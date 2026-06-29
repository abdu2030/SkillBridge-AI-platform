import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { buildFeedbackPrompt } from "./prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface FeedbackRequest {
  submissionId?: string;
  visibleTestResults?: string;
}

interface GeminiPart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment secret: ${name}`);
  }

  return value;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;

  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (match?.[1]) return match[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("Gemini did not return parseable JSON.");
}

function normalizeScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;

  return Math.max(0, Math.min(100, Math.round(score)));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header." }, 401);
    }

    const body = (await req.json()) as FeedbackRequest;
    if (!body.submissionId) {
      return jsonResponse({ error: "submissionId is required." }, 400);
    }

    const supabaseUrl = requireEnv("SUPABASE_URL");
    const anonKey = requireEnv("SUPABASE_ANON_KEY");
    const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = requireEnv("GEMINI_API_KEY");
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ error: "Invalid user session." }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const { data: submission, error: submissionError } = await adminClient
      .from("submissions")
      .select("id, task_id, user_id, status, file_snapshot, notes, submitted_at")
      .eq("id", body.submissionId)
      .single();

    if (submissionError || !submission) {
      return jsonResponse({ error: "Submission not found." }, 404);
    }

    const canReview = profile?.role === "reviewer" || profile?.role === "admin";
    if (submission.user_id !== user.id && !canReview) {
      return jsonResponse({ error: "You cannot review this submission." }, 403);
    }

    if (submission.status === "draft") {
      return jsonResponse({ error: "Draft submissions cannot be reviewed." }, 409);
    }

    const { data: task, error: taskError } = await adminClient
      .from("tasks")
      .select("id, title, summary, instructions, category, difficulty, estimated_minutes, tags")
      .eq("id", submission.task_id)
      .single();

    if (taskError || !task) {
      return jsonResponse({ error: "Task not found for submission." }, 404);
    }

    const { data: taskFiles, error: taskFilesError } = await adminClient
      .from("task_files")
      .select("file_path, file_role, language, content")
      .eq("task_id", submission.task_id)
      .in("file_role", ["visible_test", "supporting"])
      .order("sort_order", { ascending: true });

    if (taskFilesError) {
      throw taskFilesError;
    }

    const { data: rubric } = await adminClient
      .from("rubrics")
      .select("id")
      .eq("task_id", submission.task_id)
      .maybeSingle();

    const { data: rubricItems, error: rubricItemsError } = rubric?.id
      ? await adminClient
          .from("rubric_items")
          .select("label, description, max_points, position")
          .eq("rubric_id", rubric.id)
          .order("position", { ascending: true })
      : { data: [], error: null };

    if (rubricItemsError) {
      throw rubricItemsError;
    }

    const prompt = buildFeedbackPrompt({
      task,
      submittedFiles: Array.isArray(submission.file_snapshot) ? submission.file_snapshot : [],
      taskFiles: taskFiles ?? [],
      rubricItems: rubricItems ?? [],
      visibleTestResults: body.visibleTestResults?.slice(0, 12000) ?? "",
      notes: submission.notes,
    });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return jsonResponse(
        { error: "Gemini request failed.", details: errorText.slice(0, 1000) },
        502
      );
    }

    const geminiJson = (await geminiResponse.json()) as GeminiResponse;
    const text = geminiJson.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const feedback = JSON.parse(extractJson(text));
    const score = normalizeScore(feedback.score);

    if (score === null) {
      throw new Error("Gemini feedback did not include a numeric score.");
    }

    const { error: updateError } = await adminClient
      .from("submissions")
      .update({
        status: "in_review",
        score,
        reviewer_feedback: JSON.stringify(feedback),
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submission.id);

    if (updateError) {
      throw updateError;
    }

    return jsonResponse({
      submissionId: submission.id,
      score,
      feedback,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return jsonResponse({ error: message }, 500);
  }
});

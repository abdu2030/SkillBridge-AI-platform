export interface PromptTaskFile {
  file_path: string;
  file_role: string;
  language: string;
  content: string;
}

export interface PromptRubricItem {
  label: string;
  description: string;
  max_points: number;
  position: number;
}

export interface PromptSubmissionFile {
  path?: string;
  file_path?: string;
  content?: string;
}

export interface BuildFeedbackPromptInput {
  task: {
    title: string;
    summary: string;
    instructions: string;
    category: string;
    difficulty: string;
    estimated_minutes: number;
    tags: string[];
  };
  submittedFiles: PromptSubmissionFile[];
  taskFiles: PromptTaskFile[];
  rubricItems: PromptRubricItem[];
  visibleTestResults: string;
  notes: string | null;
}

function formatFiles(files: PromptSubmissionFile[]) {
  if (files.length === 0) return "No submitted files were provided.";

  return files
    .map((file) => {
      const path = file.path ?? file.file_path ?? "untitled";
      return `### ${path}\n\`\`\`\n${file.content ?? ""}\n\`\`\``;
    })
    .join("\n\n");
}

function formatTaskFiles(files: PromptTaskFile[], role: string) {
  const matchingFiles = files.filter((file) => file.file_role === role);
  if (matchingFiles.length === 0) return `No ${role.replaceAll("_", " ")} files provided.`;

  return matchingFiles
    .map((file) => `### ${file.file_path} (${file.language})\n\`\`\`\n${file.content}\n\`\`\``)
    .join("\n\n");
}

function formatRubric(items: PromptRubricItem[]) {
  if (items.length === 0) {
    return "No rubric items were provided. Use a 100 point score based on correctness, code quality, edge cases, and maintainability.";
  }

  return items
    .sort((a, b) => a.position - b.position)
    .map((item) => `- ${item.label} (${item.max_points} pts): ${item.description}`)
    .join("\n");
}

export function buildFeedbackPrompt({
  task,
  submittedFiles,
  taskFiles,
  rubricItems,
  visibleTestResults,
  notes,
}: BuildFeedbackPromptInput) {
  return `You are SkillBridge AI, a strict but constructive senior software reviewer.

Review the submission against the task instructions, submitted code, visible test results, and rubric criteria.

Return only valid JSON. Do not wrap the JSON in markdown. Do not include private hidden-test content in the feedback.

Required JSON shape:
{
  "score": number,
  "summary": string,
  "category_scores": {
    "correctness": { "score": number, "reason": string },
    "efficiency": { "score": number, "reason": string },
    "readability": { "score": number, "reason": string },
    "edge_cases": { "score": number, "reason": string },
    "maintainability": { "score": number, "reason": string },
    "security": { "score": number, "reason": string }
  },
  "strengths": string[],
  "weaknesses": string[],
  "improvement_suggestions": string[],
  "visible_test_assessment": string,
  "rubric_scores": [
    {
      "label": string,
      "max_points": number,
      "awarded_points": number,
      "reason": string
    }
  ],
  "next_steps": string[]
}

Scoring rules:
- Score must be an integer from 0 to 100.
- Each category score must be an integer from 0 to 100.
- Category score meanings:
  - correctness: Does the solution satisfy the task and pass expected behavior?
  - efficiency: Is the approach performant for realistic input sizes?
  - readability: Is the code easy to read, understand, and review?
  - edge_cases: Does it handle boundary cases and unusual inputs?
  - maintainability: Is the solution easy to extend, test, and safely change?
  - security: Does it avoid unsafe patterns, injection risks, exposed secrets, and risky file/process behavior?
- Award rubric points based only on the provided evidence.
- Be direct and professional.
- Prefer specific fixes over generic advice.
- If test results are missing, say that feedback is based on code review and visible tests only.

Task:
- Title: ${task.title}
- Category: ${task.category}
- Difficulty: ${task.difficulty}
- Estimated time: ${task.estimated_minutes} minutes
- Tags: ${task.tags.join(", ") || "None"}

Summary:
${task.summary}

Instructions:
${task.instructions}

Developer notes:
${notes || "No notes provided."}

Submitted code:
${formatFiles(submittedFiles)}

Visible tests:
${formatTaskFiles(taskFiles, "visible_test")}

Visible test results:
${visibleTestResults || "No visible test results were provided."}

Rubric:
${formatRubric(rubricItems)}
`;
}

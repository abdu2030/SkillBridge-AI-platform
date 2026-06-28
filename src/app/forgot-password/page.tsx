"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess("Password reset link sent. Check your email for the next step.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-text">SkillBridge AI</span>
          </Link>
          <h1 className="text-xl font-semibold text-text">Reset your password</h1>
          <p className="text-sm text-text-secondary mt-1">
            We&apos;ll send a secure reset link to your email.
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-error/20 bg-error-light px-3 py-2 text-xs text-error">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-success/20 bg-success-light px-3 py-2 text-xs text-success">
                {success}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Send reset link
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          Remembered your password?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

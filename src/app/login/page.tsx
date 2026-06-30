"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";
import { validateLoginForm } from "@/lib/auth/validators";

function getRedirectPath() {
  if (typeof window === "undefined") return "/dashboard";
  return new URLSearchParams(window.location.search).get("redirect_to") || "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateLoginForm({ email, password });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    router.replace(getRedirectPath());
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    setErrors({});
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      getRedirectPath()
    )}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setErrors({ form: error.message });
      setOauthLoading(false);
    }
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
          <h1 className="text-xl font-semibold text-text">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Log in to continue practicing</p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-xs">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-text bg-bg-card border border-border rounded-lg hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {oauthLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-bg-card text-text-tertiary">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="rounded-lg border border-error/20 bg-error-light px-3 py-2 text-xs text-error">
                {errors.form}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="mt-1.5 text-right">
                <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Log in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

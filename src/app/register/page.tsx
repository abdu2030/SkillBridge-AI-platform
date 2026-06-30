"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPasswordStrength, validateRegisterForm } from "@/lib/auth/validators";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(form.password);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateRegisterForm(form);
    setErrors(newErrors);
    setSuccess("");
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          role: "developer",
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    setSuccess("Account created. Check your email to confirm your SkillBridge AI account.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-text">SkillBridge AI</span>
          </Link>
          <h1 className="text-xl font-semibold text-text">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1">
            Start practicing real engineering tasks
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="rounded-lg border border-error/20 bg-error-light px-3 py-2 text-xs text-error">
                {errors.form}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-success/20 bg-success-light px-3 py-2 text-xs text-success">
                {success}
              </div>
            )}
            <Input
              label="Full name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
                hint="At least 8 characters with a mix of letters, numbers, and symbols"
                autoComplete="new-password"
              />
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          i <= strength.score ? strength.color : "bg-gray-100"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-tertiary">{strength.label}</p>
                </div>
              )}
            </div>
            <Input
              label="Confirm password"
              type="password"
              placeholder="Password"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              error={errors.confirm}
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-xs text-text-tertiary mt-4 text-center">
            By creating an account you agree to our{" "}
            <a href="#" className="underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

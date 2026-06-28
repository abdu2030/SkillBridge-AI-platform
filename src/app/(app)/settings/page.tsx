"use client";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Lock, Globe, Bell, Palette, Shield, Trash2, Sun, Moon, Monitor } from "lucide-react";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-text">{label}</span>
      <button
        onClick={onChange}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors cursor-pointer",
          checked ? "bg-accent" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [feedbackNotifs, setFeedbackNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your account, profile, and preferences.
        </p>
      </div>

      <Tabs
        tabs={[
          {
            id: "profile",
            label: "Profile",
            content: (
              <div className="space-y-5">
                <Card>
                  <CardTitle>Profile information</CardTitle>
                  <CardDescription>Update your name, bio, and public links.</CardDescription>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-accent">JD</span>
                      </div>
                      <Button variant="secondary" size="sm">
                        Change avatar
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Full name" defaultValue="Jane Doe" />
                      <Input
                        label="Username"
                        defaultValue="janedoe"
                        hint="skillbridge.ai/u/janedoe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">Bio</label>
                      <textarea
                        defaultValue="Full-stack developer specializing in Python and cloud infrastructure."
                        className="w-full h-20 text-sm border border-border rounded-lg p-3 bg-bg-card placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                      />
                    </div>
                    <Input label="GitHub URL" defaultValue="https://github.com/janedoe" />
                    <Input label="Website" defaultValue="https://janedoe.dev" />
                    <div className="flex justify-end">
                      <Button>Save changes</Button>
                    </div>
                  </div>
                </Card>
              </div>
            ),
          },
          {
            id: "account",
            label: "Account",
            content: (
              <div className="space-y-5">
                <Card>
                  <CardTitle>Email address</CardTitle>
                  <div className="mt-4">
                    <Input label="Email" defaultValue="jane@example.com" />
                    <div className="flex justify-end mt-4">
                      <Button>Update email</Button>
                    </div>
                  </div>
                </Card>
                <Card>
                  <CardTitle>Change password</CardTitle>
                  <div className="mt-4 space-y-4">
                    <Input label="Current password" type="password" />
                    <Input label="New password" type="password" hint="At least 8 characters" />
                    <Input label="Confirm new password" type="password" />
                    <div className="flex justify-end">
                      <Button>Update password</Button>
                    </div>
                  </div>
                </Card>
              </div>
            ),
          },
          {
            id: "portfolio",
            label: "Portfolio",
            content: (
              <Card>
                <CardTitle>Portfolio visibility</CardTitle>
                <CardDescription>
                  Control who can see your portfolio and approved tasks.
                </CardDescription>
                <div className="mt-4 space-y-4">
                  <Toggle
                    checked={portfolioPublic}
                    onChange={() => setPortfolioPublic(!portfolioPublic)}
                    label="Make portfolio public"
                  />
                  <p className="text-xs text-text-tertiary">
                    {portfolioPublic
                      ? "Your portfolio is visible at skillbridge.ai/u/janedoe"
                      : "Your portfolio is hidden from public view"}
                  </p>
                </div>
              </Card>
            ),
          },
          {
            id: "notifications",
            label: "Notifications",
            content: (
              <Card>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose which notifications you receive.</CardDescription>
                <div className="mt-4 space-y-4">
                  <Toggle
                    checked={emailNotifs}
                    onChange={() => setEmailNotifs(!emailNotifs)}
                    label="Email notifications"
                  />
                  <Toggle
                    checked={feedbackNotifs}
                    onChange={() => setFeedbackNotifs(!feedbackNotifs)}
                    label="Feedback received"
                  />
                  <Toggle
                    checked={weeklyDigest}
                    onChange={() => setWeeklyDigest(!weeklyDigest)}
                    label="Weekly progress digest"
                  />
                </div>
              </Card>
            ),
          },
          {
            id: "theme",
            label: "Theme",
            content: (
              <Card>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Choose your preferred theme.</CardDescription>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { id: "light" as const, label: "Light", icon: Sun },
                    { id: "dark" as const, label: "Dark", icon: Moon },
                    { id: "system" as const, label: "System", icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                        theme === t.id
                          ? "border-accent bg-accent-light"
                          : "border-border hover:border-border-strong"
                      )}
                    >
                      <t.icon
                        className={cn(
                          "w-5 h-5",
                          theme === t.id ? "text-accent" : "text-text-secondary"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          theme === t.id ? "text-accent" : "text-text-secondary"
                        )}
                      >
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            id: "security",
            label: "Security",
            content: (
              <div className="space-y-5">
                <Card>
                  <CardTitle>Two-factor authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  <div className="mt-4">
                    <Button variant="secondary">Enable 2FA</Button>
                  </div>
                </Card>
                <Card className="border-error/20">
                  <CardTitle className="text-error">Danger zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data.
                  </CardDescription>
                  <div className="mt-4">
                    <Button variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                      Delete account
                    </Button>
                  </div>
                  <p className="text-xs text-text-tertiary mt-2">
                    This action is irreversible. All your submissions, portfolio data, and account
                    information will be permanently deleted.
                  </p>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

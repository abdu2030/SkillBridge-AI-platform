"use client";

import { useToast } from "@/components/ui/toast";
import { useState } from "react";

interface CopyProfileLinkProps {
  url: string;
  disabled?: boolean;
}

export function CopyProfileLink({ url, disabled }: CopyProfileLinkProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  async function handleCopy() {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast({
        title: "Portfolio link copied",
        description: "The full public URL is ready to share.",
        tone: "success",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        title: "Copy failed",
        description: "Select the browser address bar and copy the URL manually.",
        tone: "error",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-card px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {copied ? "Copied link" : "Copy link"}
    </button>
  );
}

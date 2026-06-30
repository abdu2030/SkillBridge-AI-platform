"use client";

import { useState } from "react";

interface CopyProfileLinkProps {
  url: string;
  disabled?: boolean;
}

export function CopyProfileLink({ url, disabled }: CopyProfileLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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

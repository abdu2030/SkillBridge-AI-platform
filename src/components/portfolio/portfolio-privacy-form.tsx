"use client";

import type { FormEvent } from "react";

interface PortfolioPrivacyFormProps {
  isPublic: boolean;
  action: (formData: FormData) => void | Promise<void>;
}

export function PortfolioPrivacyForm({ isPublic, action }: PortfolioPrivacyFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const message = isPublic
      ? "Make your public portfolio private? Shared profile links will stop showing approved work."
      : "Make your portfolio public? Employers and anyone with the link can view approved evidence.";

    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="portfolio_is_public" value={isPublic ? "false" : "true"} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-card px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover"
      >
        {isPublic ? "Make private" : "Make public"}
      </button>
    </form>
  );
}

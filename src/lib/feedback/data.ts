export type FeedbackCategory =
  "correctness" | "efficiency" | "readability" | "edge_cases" | "maintainability" | "security";

export interface FeedbackCategoryScore {
  key: FeedbackCategory;
  label: string;
  score: number;
  reason: string;
}

export interface FeedbackRecord {
  id: string;
  submissionId: string;
  taskTitle: string;
  category: string;
  status: "AI reviewed" | "Needs improvement" | "Approved";
  overallScore: number;
  submittedAt: string;
  generatedAt: string;
  visibleTestAssessment: string;
  summary: string;
  categoryScores: FeedbackCategoryScore[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  nextSteps: string[];
}

export const sampleFeedback: FeedbackRecord = {
  id: "feedback-1",
  submissionId: "1",
  taskTitle: "Fix broken Python CSV parser",
  category: "Python",
  status: "AI reviewed",
  overallScore: 84,
  submittedAt: "42 minutes ago",
  generatedAt: "Just now",
  visibleTestAssessment:
    "Most visible tests pass. The remaining risk is around malformed rows, very large files, and rows that contain only delimiters.",
  summary:
    "The submission is clean and close to production-ready. It uses Python's standard CSV tools correctly, keeps the implementation small, and handles quoted commas well. The next improvement should focus on stronger malformed-row handling and clearer behavior for empty rows.",
  categoryScores: [
    {
      key: "correctness",
      label: "Correctness",
      score: 88,
      reason: "Core parsing behavior works for normal files, quoted values, and empty input.",
    },
    {
      key: "efficiency",
      label: "Efficiency",
      score: 82,
      reason:
        "The implementation is efficient enough for common CSV sizes and avoids heavy parsing work.",
    },
    {
      key: "readability",
      label: "Readability",
      score: 91,
      reason: "The code is short, idiomatic, and easy to review.",
    },
    {
      key: "edge_cases",
      label: "Edge cases",
      score: 74,
      reason:
        "Several edge cases are covered, but malformed rows and delimiter-only rows need clearer handling.",
    },
    {
      key: "maintainability",
      label: "Maintainability",
      score: 86,
      reason:
        "The function has a small surface area and can be extended with additional validation.",
    },
    {
      key: "security",
      label: "Security",
      score: 92,
      reason: "No unsafe file execution, shell calls, or exposed secret handling were introduced.",
    },
  ],
  strengths: [
    "Uses Python's standard csv module instead of hand-parsing comma-separated text.",
    "Keeps the function compact and easy to reason about.",
    "Handles quoted commas and empty input safely.",
    "Normalizes values by trimming whitespace before returning rows.",
  ],
  weaknesses: [
    "Malformed rows are not reported with a clear validation error.",
    "Delimiter-only rows are skipped, but the behavior is not documented in the code.",
    "The tests do not yet cover inconsistent headers or unexpected extra columns.",
  ],
  improvementSuggestions: [
    "Add explicit validation for rows with missing or extra columns.",
    "Document whether delimiter-only rows should be skipped or returned as empty values.",
    "Add tests for malformed CSV content and files with mixed line endings.",
  ],
  nextSteps: [
    "Add one regression test for malformed rows.",
    "Add one test for delimiter-only rows.",
    "Update the function docstring with the expected empty-row behavior.",
  ],
};

export function getScoreTone(score: number): "success" | "warning" | "error" | "accent" {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  if (score >= 50) return "accent";
  return "error";
}

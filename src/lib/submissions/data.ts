export type SubmissionStatus = "Pending" | "Reviewed" | "Approved" | "Needs improvement";

export interface SubmissionFile {
  path: string;
  content: string;
}

export interface SubmissionResult {
  id: string;
  task: string;
  category: string;
  status: SubmissionStatus;
  score: number | null;
  attempt: number;
  submittedAt: string;
  reviewedBy: string | null;
  feedbackReady: boolean;
  summary: string;
  files: SubmissionFile[];
  rubricPreview: Array<{
    label: string;
    points: number;
    maxPoints: number;
    note: string;
  }>;
}

export const submissionResults: SubmissionResult[] = [
  {
    id: "1",
    task: "Fix broken Python CSV parser",
    category: "Python",
    score: 84,
    status: "Reviewed",
    attempt: 2,
    submittedAt: "42 minutes ago",
    reviewedBy: "AI + Sarah Chen",
    feedbackReady: true,
    summary:
      "The parser now handles quoted commas, empty rows, and newline-safe fields. Feedback is available for edge-case coverage.",
    files: [
      {
        path: "csv_parser.py",
        content: `import csv
from io import StringIO


def parse_csv(source: str) -> list[dict[str, str]]:
    if not source.strip():
        return []

    reader = csv.DictReader(StringIO(source))
    rows: list[dict[str, str]] = []

    for row in reader:
        if row is None or all(value in (None, "") for value in row.values()):
            continue

        rows.append({key: (value or "").strip() for key, value in row.items()})

    return rows
`,
      },
      {
        path: "test_csv_parser.py",
        content: `from csv_parser import parse_csv


def test_parses_quoted_commas():
    data = 'name,notes\\n"Ada","likes Python, Docker, and tests"'

    assert parse_csv(data) == [
        {"name": "Ada", "notes": "likes Python, Docker, and tests"}
    ]


def test_skips_empty_rows():
    data = "name,notes\\nAda,ready\\n,"

    assert parse_csv(data) == [{"name": "Ada", "notes": "ready"}]
`,
      },
    ],
    rubricPreview: [
      {
        label: "Correctness",
        points: 34,
        maxPoints: 40,
        note: "Core parsing behavior works for quoted values and empty input.",
      },
      {
        label: "Edge cases",
        points: 26,
        maxPoints: 35,
        note: "Good coverage, but malformed row handling still needs a stronger guard.",
      },
      {
        label: "Code clarity",
        points: 24,
        maxPoints: 25,
        note: "Small, readable implementation with clear standard-library usage.",
      },
    ],
  },
  {
    id: "2",
    task: "Debug async request handler",
    category: "Python",
    score: 91,
    status: "Approved",
    attempt: 1,
    submittedAt: "2 hours ago",
    reviewedBy: "AI + Marcus Lee",
    feedbackReady: true,
    summary:
      "Async error handling and timeout behavior were fixed without blocking the event loop.",
    files: [
      {
        path: "handler.py",
        content: `import asyncio


async def fetch_with_timeout(client, url: str, timeout: float = 3.0):
    try:
        return await asyncio.wait_for(client.get(url), timeout=timeout)
    except asyncio.TimeoutError as exc:
        raise RuntimeError(f"Request timed out for {url}") from exc
`,
      },
    ],
    rubricPreview: [
      {
        label: "Async behavior",
        points: 38,
        maxPoints: 40,
        note: "Uses await correctly and avoids blocking calls.",
      },
      {
        label: "Error handling",
        points: 28,
        maxPoints: 30,
        note: "Timeouts are clear and traceable.",
      },
      {
        label: "Tests",
        points: 25,
        maxPoints: 30,
        note: "Covers the success and timeout paths.",
      },
    ],
  },
  {
    id: "3",
    task: "Review AI-generated Dockerfile",
    category: "Code Review",
    score: 72,
    status: "Needs improvement",
    attempt: 3,
    submittedAt: "1 day ago",
    reviewedBy: "AI + Priya Shah",
    feedbackReady: true,
    summary:
      "The review caught the main security issue, but missed a cache and image-size improvement.",
    files: [
      {
        path: "review-notes.md",
        content: `# Dockerfile review

- Pin the base image to a specific digest before production use.
- Move dependency installation before copying the full source tree.
- Run the app as a non-root user.
- Add a healthcheck once the service endpoint is stable.
`,
      },
    ],
    rubricPreview: [
      {
        label: "Issue detection",
        points: 29,
        maxPoints: 40,
        note: "Security issue found, but image-size concerns were incomplete.",
      },
      {
        label: "Actionability",
        points: 25,
        maxPoints: 35,
        note: "Most notes are useful and specific.",
      },
      {
        label: "Professional tone",
        points: 18,
        maxPoints: 25,
        note: "Clear and respectful review language.",
      },
    ],
  },
  {
    id: "4",
    task: "Resolve Git rebase conflict",
    category: "Git",
    score: 95,
    status: "Approved",
    attempt: 1,
    submittedAt: "3 days ago",
    reviewedBy: "AI + Daniel Kim",
    feedbackReady: true,
    summary:
      "Conflict resolution preserved both changes and documented the final branch state clearly.",
    files: [
      {
        path: "resolution.md",
        content: `# Rebase resolution

The conflict happened because both branches edited the same validation block.

Final resolution:
- Kept the stricter input validation.
- Preserved the new error message.
- Ran the affected unit tests after the rebase.
`,
      },
    ],
    rubricPreview: [
      {
        label: "Resolution quality",
        points: 40,
        maxPoints: 40,
        note: "No behavior was lost during the conflict resolution.",
      },
      {
        label: "Git workflow",
        points: 30,
        maxPoints: 35,
        note: "Clean rebase and clear validation after completion.",
      },
      {
        label: "Explanation",
        points: 25,
        maxPoints: 25,
        note: "The notes explain what changed and why.",
      },
    ],
  },
  {
    id: "5",
    task: "Fix Docker multi-stage build",
    category: "Docker",
    score: null,
    status: "Pending",
    attempt: 1,
    submittedAt: "4 days ago",
    reviewedBy: null,
    feedbackReady: false,
    summary: "This submission is waiting for review. Feedback will appear here once available.",
    files: [
      {
        path: "Dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
`,
      },
    ],
    rubricPreview: [
      {
        label: "Correctness",
        points: 0,
        maxPoints: 40,
        note: "Pending review.",
      },
      {
        label: "Build reliability",
        points: 0,
        maxPoints: 35,
        note: "Pending review.",
      },
      {
        label: "Image quality",
        points: 0,
        maxPoints: 25,
        note: "Pending review.",
      },
    ],
  },
];

export function getSubmissionResult(id: string) {
  return submissionResults.find((submission) => submission.id === id);
}

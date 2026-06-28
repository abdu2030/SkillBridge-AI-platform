export type TaskStatus = "Not started" | "In progress" | "Submitted" | "Approved";
export type TaskDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type TaskTestVisibility = "visible" | "hidden";

export interface TaskFile {
  name: string;
  lines: number;
  language: string;
  role: "Starter" | "Visible test" | "Hidden test" | "Supporting";
}

export interface TaskTest {
  name: string;
  description: string;
  visibility: TaskTestVisibility;
}

export interface RubricItem {
  label: string;
  points: number;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  skills: string[];
  status: TaskStatus;
  summary: string;
  instructions: string[];
  expectedBehavior: string[];
  starterFiles: TaskFile[];
  tests: TaskTest[];
  rubric: RubricItem[];
}

export const defaultRubric: RubricItem[] = [
  {
    label: "Correctness",
    points: 40,
    description: "Solves the required behavior without breaking existing functionality.",
  },
  {
    label: "Edge cases",
    points: 20,
    description: "Handles boundary cases, invalid inputs, and realistic failure paths.",
  },
  {
    label: "Code quality",
    points: 20,
    description: "Uses clear names, simple structure, and maintainable implementation choices.",
  },
  {
    label: "Testing",
    points: 10,
    description: "Adds or updates useful tests that protect the fix.",
  },
  {
    label: "Explanation",
    points: 10,
    description: "Explains the approach, tradeoffs, and any important assumptions.",
  },
];

export const tasks: Task[] = [
  {
    id: "csv-parser",
    title: "Fix broken Python CSV parser",
    category: "Python Debugging",
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    skills: ["Python", "File I/O", "Error Handling", "String Parsing", "Edge Cases"],
    status: "Not started",
    summary:
      "The parser works for simple files but fails on empty rows, quoted commas, and missing headers.",
    instructions: [
      "Investigate the existing CSV parser and identify why quoted fields and empty rows fail.",
      "Fix the parser while keeping the public function signature unchanged.",
      "Update the tests to cover the fixed behavior and write a short explanation of the change.",
    ],
    expectedBehavior: [
      "Empty rows are skipped without throwing an unexpected error.",
      "Fields containing commas are parsed correctly when wrapped in quotes.",
      "Missing headers raise a clear ValueError with a useful message.",
      "Both LF and CRLF line endings are accepted.",
    ],
    starterFiles: [
      { name: "parser.py", lines: 48, language: "Python", role: "Starter" },
      { name: "test_parser.py", lines: 32, language: "Python", role: "Visible test" },
      { name: "sample_data.csv", lines: 15, language: "CSV", role: "Supporting" },
    ],
    tests: [
      {
        name: "test_basic_csv",
        description: "Parses a simple three-row CSV with headers.",
        visibility: "visible",
      },
      {
        name: "test_empty_file",
        description: "Returns an empty list for an empty file.",
        visibility: "visible",
      },
      {
        name: "test_quoted_commas",
        description: "Handles commas inside quoted fields.",
        visibility: "visible",
      },
      {
        name: "hidden_csv_edge_cases",
        description: "Validates mixed line endings, missing headers, and malformed quoted values.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "docker-multistage",
    title: "Fix Docker multi-stage build",
    category: "Docker",
    difficulty: "Intermediate",
    estimatedMinutes: 30,
    skills: ["Docker", "CI/CD", "Build Optimization"],
    status: "Not started",
    summary:
      "The Dockerfile builds locally but fails in CI. Fix the multi-stage build and reduce the final image size.",
    instructions: [
      "Review the current Dockerfile and CI build logs.",
      "Fix the missing dependency and stage-copy issue causing the CI build to fail.",
      "Keep the runtime image small and document the reason for each stage.",
    ],
    expectedBehavior: [
      "The image builds successfully in a clean CI environment.",
      "Only runtime dependencies are present in the final image.",
      "The app starts with the documented production command.",
    ],
    starterFiles: [
      { name: "Dockerfile", lines: 42, language: "Dockerfile", role: "Starter" },
      { name: ".dockerignore", lines: 18, language: "Text", role: "Starter" },
      { name: "build.test.sh", lines: 26, language: "Shell", role: "Visible test" },
    ],
    tests: [
      {
        name: "test_ci_build",
        description: "Builds the image without cached layers.",
        visibility: "visible",
      },
      {
        name: "test_runtime_command",
        description: "Runs the container and checks the health endpoint.",
        visibility: "visible",
      },
      {
        name: "hidden_image_size_budget",
        description: "Checks the final image size and dependency footprint.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "async-handler",
    title: "Debug async Python request handler",
    category: "Python Debugging",
    difficulty: "Advanced",
    estimatedMinutes: 45,
    skills: ["Python", "Async/Await", "HTTP", "Concurrency"],
    status: "Submitted",
    summary:
      "The async handler drops connections under load. Find the race condition and fix the connection pool logic.",
    instructions: [
      "Reproduce the intermittent connection failure with the provided load test.",
      "Find the shared state issue in the async connection pool.",
      "Fix the handler without blocking the event loop.",
    ],
    expectedBehavior: [
      "Concurrent requests complete without dropped connections.",
      "Connection cleanup happens even when a request fails.",
      "The handler keeps async behavior and does not introduce blocking calls.",
    ],
    starterFiles: [
      { name: "handler.py", lines: 76, language: "Python", role: "Starter" },
      { name: "pool.py", lines: 64, language: "Python", role: "Starter" },
      { name: "test_load.py", lines: 41, language: "Python", role: "Visible test" },
    ],
    tests: [
      {
        name: "test_single_request",
        description: "Processes a normal request successfully.",
        visibility: "visible",
      },
      {
        name: "test_concurrent_requests",
        description: "Runs parallel requests against the handler.",
        visibility: "visible",
      },
      {
        name: "hidden_connection_cleanup",
        description: "Verifies cleanup after cancellation and timeout paths.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "ai-dockerfile-review",
    title: "Review AI-generated Dockerfile",
    category: "Code Review",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    skills: ["Docker", "Security", "Code Review"],
    status: "In progress",
    summary:
      "Review an AI-generated Dockerfile and identify security issues, inefficiencies, and best practice violations.",
    instructions: [
      "Read the generated Dockerfile and supporting notes.",
      "Identify security, reliability, and image-size concerns.",
      "Write review comments with concrete fixes and priority levels.",
    ],
    expectedBehavior: [
      "Review comments identify risky root usage and unpinned dependencies.",
      "The feedback explains why each issue matters.",
      "Suggested fixes are specific enough for another developer to apply.",
    ],
    starterFiles: [
      { name: "Dockerfile.generated", lines: 34, language: "Dockerfile", role: "Starter" },
      { name: "review_template.md", lines: 22, language: "Markdown", role: "Starter" },
      { name: "rubric_notes.md", lines: 18, language: "Markdown", role: "Supporting" },
    ],
    tests: [
      {
        name: "visible_review_checklist",
        description: "Checks that required review sections are completed.",
        visibility: "visible",
      },
      {
        name: "hidden_security_findings",
        description: "Checks whether high-impact security issues were identified.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "git-rebase",
    title: "Resolve Git rebase conflict",
    category: "Git",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    skills: ["Git", "Version Control", "Conflict Resolution"],
    status: "Approved",
    summary:
      "A feature branch has conflicts after rebasing onto main. Resolve the conflicts and maintain both changes.",
    instructions: [
      "Inspect the conflicted files and understand both sides of the change.",
      "Resolve the conflict without deleting either feature.",
      "Record a short summary of the conflict and final behavior.",
    ],
    expectedBehavior: [
      "Both main branch validation and feature branch formatting are preserved.",
      "The project tests pass after the conflict is resolved.",
      "The final diff is small and easy to review.",
    ],
    starterFiles: [
      { name: "profile_service.ts", lines: 88, language: "TypeScript", role: "Starter" },
      { name: "profile_service.test.ts", lines: 54, language: "TypeScript", role: "Visible test" },
    ],
    tests: [
      {
        name: "test_profile_validation",
        description: "Confirms validation from main branch still works.",
        visibility: "visible",
      },
      {
        name: "test_feature_formatting",
        description: "Confirms feature branch formatting still works.",
        visibility: "visible",
      },
      {
        name: "hidden_diff_quality",
        description: "Checks that the conflict resolution did not introduce unrelated changes.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "sql-injection",
    title: "Fix SQL injection vulnerability",
    category: "Security",
    difficulty: "Advanced",
    estimatedMinutes: 40,
    skills: ["SQL", "Security", "Backend"],
    status: "Not started",
    summary:
      "The user search endpoint is vulnerable to SQL injection. Fix the query construction without breaking existing functionality.",
    instructions: [
      "Confirm the vulnerable query path with the provided failing test.",
      "Replace unsafe string interpolation with parameterized queries.",
      "Keep filtering, sorting, and pagination behavior intact.",
    ],
    expectedBehavior: [
      "Search input is treated as data, never executable SQL.",
      "Legitimate partial-name searches still return expected users.",
      "Pagination and sort order remain stable.",
    ],
    starterFiles: [
      { name: "users.repository.ts", lines: 67, language: "TypeScript", role: "Starter" },
      { name: "users.repository.test.ts", lines: 58, language: "TypeScript", role: "Visible test" },
      { name: "schema.sql", lines: 44, language: "SQL", role: "Supporting" },
    ],
    tests: [
      {
        name: "test_normal_search",
        description: "Searches users by partial name.",
        visibility: "visible",
      },
      {
        name: "test_injection_payload",
        description: "Confirms malicious input does not alter the query.",
        visibility: "visible",
      },
      {
        name: "hidden_sort_and_pagination",
        description: "Checks sort and pagination edge cases after the security fix.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "rest-api-integration",
    title: "Integrate third-party REST API",
    category: "API Integration",
    difficulty: "Intermediate",
    estimatedMinutes: 40,
    skills: ["REST API", "Error Handling", "TypeScript"],
    status: "Not started",
    summary:
      "Connect to an external weather API, handle rate limiting, retries, and transform the response into the app schema.",
    instructions: [
      "Implement the API client using the provided typed response schema.",
      "Handle 429, 500, timeout, and malformed response cases.",
      "Map the external response into the internal forecast format.",
    ],
    expectedBehavior: [
      "Successful responses are transformed into the app forecast schema.",
      "Rate-limited requests retry with backoff and then fail clearly.",
      "Malformed responses return a typed error instead of crashing.",
    ],
    starterFiles: [
      { name: "weatherClient.ts", lines: 52, language: "TypeScript", role: "Starter" },
      { name: "forecastMapper.ts", lines: 28, language: "TypeScript", role: "Starter" },
      { name: "weatherClient.test.ts", lines: 73, language: "TypeScript", role: "Visible test" },
    ],
    tests: [
      {
        name: "test_success_mapping",
        description: "Maps a valid API response into the internal schema.",
        visibility: "visible",
      },
      {
        name: "test_rate_limit_retry",
        description: "Retries a rate-limited response before failing.",
        visibility: "visible",
      },
      {
        name: "hidden_timeout_and_bad_json",
        description: "Checks timeout and malformed JSON handling.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "react-state-bug",
    title: "Fix React state management bug",
    category: "Frontend",
    difficulty: "Intermediate",
    estimatedMinutes: 30,
    skills: ["React", "State Management", "Hooks"],
    status: "Not started",
    summary:
      "The shopping cart component loses items when navigating between pages. Fix the state persistence issue.",
    instructions: [
      "Reproduce the cart reset by navigating between product and checkout views.",
      "Move cart state to the intended shared store without changing the UI contract.",
      "Add coverage for item persistence and quantity updates.",
    ],
    expectedBehavior: [
      "Cart items remain after route changes.",
      "Quantity updates and removals continue to work.",
      "The fix does not duplicate cart items during re-render.",
    ],
    starterFiles: [
      { name: "CartProvider.tsx", lines: 61, language: "TSX", role: "Starter" },
      { name: "cartReducer.ts", lines: 47, language: "TypeScript", role: "Starter" },
      { name: "cart.test.tsx", lines: 69, language: "TSX", role: "Visible test" },
    ],
    tests: [
      {
        name: "test_add_item",
        description: "Adds an item to the cart.",
        visibility: "visible",
      },
      {
        name: "test_route_persistence",
        description: "Keeps cart items after navigation.",
        visibility: "visible",
      },
      {
        name: "hidden_duplicate_guard",
        description: "Checks repeated renders do not duplicate cart items.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
  {
    id: "unit-test-coverage",
    title: "Write unit tests for auth module",
    category: "Backend",
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    skills: ["Testing", "Jest", "Authentication"],
    status: "Not started",
    summary:
      "The authentication module has no meaningful test coverage. Write tests for login, registration, and token refresh.",
    instructions: [
      "Review the auth service behavior and existing test setup.",
      "Add tests for successful and failed login, registration validation, and token refresh.",
      "Mock external auth provider calls without hiding service behavior.",
    ],
    expectedBehavior: [
      "Auth service tests cover success and failure paths.",
      "External provider calls are mocked with realistic responses.",
      "Coverage improves without brittle implementation-only assertions.",
    ],
    starterFiles: [
      { name: "auth.service.ts", lines: 82, language: "TypeScript", role: "Starter" },
      { name: "auth.service.test.ts", lines: 18, language: "TypeScript", role: "Visible test" },
      { name: "auth.fixtures.ts", lines: 24, language: "TypeScript", role: "Supporting" },
    ],
    tests: [
      {
        name: "test_login_success",
        description: "Covers a successful login response.",
        visibility: "visible",
      },
      {
        name: "test_login_failure",
        description: "Covers invalid credentials.",
        visibility: "visible",
      },
      {
        name: "hidden_refresh_and_registration",
        description: "Checks token refresh and registration validation cases.",
        visibility: "hidden",
      },
    ],
    rubric: defaultRubric,
  },
];

export const taskCategories = [
  "All",
  ...Array.from(new Set(tasks.map((task) => task.category))).sort(),
];

export const taskDifficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id);
}

export function getVisibleTestCount(task: Task) {
  return task.tests.filter((test) => test.visibility === "visible").length;
}

export function getHiddenTestCount(task: Task) {
  return task.tests.filter((test) => test.visibility === "hidden").length;
}

export function getRubricTotal(task: Task) {
  return task.rubric.reduce((total, item) => total + item.points, 0);
}

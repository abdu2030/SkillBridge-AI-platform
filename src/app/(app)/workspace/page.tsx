"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodeEditor } from "@/components/workspace/code-editor";
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  FileCode,
  BookOpen,
  ListChecks,
  MessageSquare,
  StickyNote,
  Save,
  Loader2,
} from "lucide-react";

const pythonStarter = `import csv
from typing import List, Dict

def parse_csv(file_path: str) -> List[Dict[str, str]]:
    """Parse a CSV file and return a list of dictionaries.
    
    Each dictionary maps column headers to row values.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        List of dictionaries, one per row
        
    Raises:
        ValueError: If the file has no headers
        FileNotFoundError: If the file doesn't exist
    """
    results = []
    
    with open(file_path, 'r', newline='') as f:
        reader = csv.reader(f)
        
        # Read headers
        headers = next(reader, None)
        if not headers:
            raise ValueError("CSV file has no headers")
        
        # Strip whitespace from headers
        headers = [h.strip() for h in headers]
        
        for row in reader:
            # Skip empty rows
            if not row or all(cell.strip() == '' for cell in row):
                continue
            
            # Map headers to values
            row_dict = {}
            for i, header in enumerate(headers):
                if i < len(row):
                    row_dict[header] = row[i].strip()
                else:
                    row_dict[header] = ''
            
            results.append(row_dict)
    
    return results`;

const javascriptStarter = `export function normalizeRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.trim(), String(value).trim()])
  );
}

export function hasRequiredHeaders(headers) {
  return Array.isArray(headers) && headers.every((header) => header.length > 0);
}`;

const dockerfileStarter = `FROM python:3.12-slim AS base
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "-m", "pytest"]`;

const jsonStarter = `{
  "task": "csv-parser",
  "visibleTests": ["test_basic_csv", "test_empty_file", "test_quoted_commas"],
  "hiddenTests": 5
}`;

const markdownStarter = `# Solution notes

## Approach

- Explain the parsing issue.
- Describe the fix.
- List edge cases covered by tests.`;

const workspaceFiles = [
  { name: "parser.py", content: pythonStarter },
  { name: "helpers.js", content: javascriptStarter },
  { name: "Dockerfile", content: dockerfileStarter },
  { name: "task-config.json", content: jsonStarter },
  { name: "solution-notes.md", content: markdownStarter },
];

const rubricItems = [
  { label: "Correctness", points: 40 },
  { label: "Edge cases", points: 20 },
  { label: "Readability", points: 15 },
  { label: "Maintainability", points: 15 },
  { label: "Explanation", points: 10 },
];

const testResults = [
  { name: "test_basic_csv", status: "pass" as const, time: "0.02s" },
  { name: "test_empty_file", status: "pass" as const, time: "0.01s" },
  { name: "test_quoted_commas", status: "fail" as const, time: "0.03s" },
];

export default function WorkspacePage() {
  const [activeFile, setActiveFile] = useState("parser.py");
  const [fileContents, setFileContents] = useState(() =>
    Object.fromEntries(workspaceFiles.map((file) => [file.name, file.content]))
  );
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
  const [rightTab, setRightTab] = useState("rubric");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [testsRunning, setTestsRunning] = useState(false);
  const [testsRan, setTestsRan] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  const files = workspaceFiles.map((file) => file.name);
  const activeContent = fileContents[activeFile] ?? "";
  const activeFileDirty = dirtyFiles.has(activeFile);

  const handleRunTests = () => {
    setTestsRunning(true);
    setRightTab("tests");
    setTimeout(() => {
      setTestsRunning(false);
      setTestsRan(true);
    }, 2000);
  };

  const handleSave = () => {
    const fileToSave = activeFile;
    setSaveStatus("saving");
    setTimeout(() => {
      setDirtyFiles((current) => {
        const next = new Set(current);
        next.delete(fileToSave);
        return next;
      });
      setSaveStatus("saved");
    }, 1000);
  };

  const handleReset = () => {
    const starter = workspaceFiles.find((file) => file.name === activeFile);
    if (!starter) return;
    setFileContents((current) => ({ ...current, [activeFile]: starter.content }));
    setDirtyFiles((current) => new Set(current).add(activeFile));
    setSaveStatus("unsaved");
  };

  const handleEditorChange = (value: string) => {
    setFileContents((current) => ({ ...current, [activeFile]: value }));
    setDirtyFiles((current) => new Set(current).add(activeFile));
    setSaveStatus("unsaved");
  };

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
    setSaveStatus(dirtyFiles.has(fileName) ? "unsaved" : "saved");
  };

  return (
    <div className="-mx-4 md:-mx-6 -my-6">
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Workspace Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-card shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-text">Fix broken Python CSV parser</h2>
            <Badge variant="outline">Intermediate</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Clock className="w-3 h-3" />
            <span>35 min estimated</span>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Instructions */}
          <div
            className={cn(
              "border-r border-border bg-bg-card overflow-y-auto transition-all duration-200 shrink-0",
              leftCollapsed ? "w-0 opacity-0" : "w-80"
            )}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-text-secondary" />
                <h3 className="text-sm font-semibold text-text">Instructions</h3>
              </div>

              <div className="space-y-3 text-sm text-text-secondary">
                <p className="font-medium text-text">Problem</p>
                <p>The CSV parser works for simple files but fails on:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Empty rows</li>
                  <li>Quoted commas in fields</li>
                  <li>Missing headers</li>
                  <li>
                    Mixed line endings (<code className="bg-gray-100 px-1 rounded">\n</code> vs{" "}
                    <code className="bg-gray-100 px-1 rounded">\r\n</code>)
                  </li>
                </ul>

                <p className="font-medium text-text pt-2">Requirements</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Fix all edge cases above</li>
                  <li>Keep the existing function signature</li>
                  <li>Raise descriptive errors for invalid input</li>
                  <li>Add inline comments for non-obvious logic</li>
                </ul>

                <p className="font-medium text-text pt-2">Example</p>
                <div className="bg-gray-50 border border-border rounded-lg p-3 font-mono text-xs">
                  <p className="text-text-tertiary"># Input: data.csv</p>
                  <p>name,city,age</p>
                  <p>Alice,&quot;New York, NY&quot;,30</p>
                  <p></p>
                  <p>Bob,Chicago,25</p>
                  <p className="text-text-tertiary mt-2"># Expected output:</p>
                  <p>{`[{"name": "Alice", ...}, {"name": "Bob", ...}]`}</p>
                </div>

                <p className="font-medium text-text pt-2">Files</p>
                <div className="space-y-1.5">
                  {files.map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFileSelect(f)}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer",
                        activeFile === f
                          ? "bg-accent-light text-accent"
                          : "text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      <FileCode className="w-3 h-3" />
                      <span className="min-w-0 flex-1 truncate text-left">{f}</span>
                      {dirtyFiles.has(f) && <span className="text-warning">*</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel Toggle */}
          <button
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            className="w-5 flex items-center justify-center border-r border-border bg-bg-card hover:bg-surface-hover transition-colors shrink-0 cursor-pointer"
          >
            <ChevronRight
              className={cn(
                "w-3 h-3 text-text-tertiary transition-transform",
                !leftCollapsed && "rotate-180"
              )}
            />
          </button>

          {/* Center Panel - Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* File Tabs */}
            <div className="flex items-center border-b border-border bg-bg-card shrink-0 min-w-0">
              <div className="flex min-w-0 flex-1 overflow-x-auto px-2">
                {files.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFileSelect(f)}
                    className={cn(
                      "shrink-0 whitespace-nowrap px-3 py-2 text-xs font-mono border-b-2 -mb-px transition-colors cursor-pointer",
                      activeFile === f
                        ? "border-accent text-accent bg-bg"
                        : "border-transparent text-text-secondary hover:text-text"
                    )}
                  >
                    {f}
                    {dirtyFiles.has(f) && <span className="ml-1 text-warning">*</span>}
                  </button>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-1 border-l border-border bg-bg-card px-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
                  title="Save"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-text-tertiary hover:text-text transition-colors cursor-pointer"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 overflow-hidden bg-[#1e1e2e] relative">
              <CodeEditor
                fileName={activeFile}
                value={activeContent}
                onChange={handleEditorChange}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 border-l border-border bg-bg-card overflow-y-auto shrink-0 hidden lg:block">
            <div className="flex border-b border-border">
              {[
                { id: "rubric", label: "Rubric", icon: ListChecks },
                { id: "tests", label: "Tests", icon: Play },
                { id: "feedback", label: "Feedback", icon: MessageSquare },
                { id: "notes", label: "Notes", icon: StickyNote },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id)}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer",
                    rightTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-text-tertiary hover:text-text-secondary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {rightTab === "rubric" && (
                <div className="space-y-4">
                  <p className="text-xs text-text-secondary">Total: 100 points</p>
                  {rubricItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-text">{item.label}</span>
                        <span className="text-xs text-text-tertiary tabular-nums">
                          {item.points} pts
                        </span>
                      </div>
                      <Progress value={item.points} max={40} color="accent" size="sm" />
                    </div>
                  ))}
                </div>
              )}

              {rightTab === "tests" && (
                <div className="space-y-3">
                  {testsRunning ? (
                    <div className="flex items-center gap-2 py-8 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <span className="text-sm text-text-secondary">Running visible tests…</span>
                    </div>
                  ) : testsRan ? (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">2 passed, 1 failed</span>
                        <Badge variant="warning">2/3</Badge>
                      </div>
                      {testResults.map((test) => (
                        <div
                          key={test.name}
                          className="flex items-start gap-2 p-2 rounded-lg border border-border"
                        >
                          {test.status === "pass" ? (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-xs font-mono font-medium text-text">{test.name}</p>
                            <p className="text-xs text-text-tertiary">{test.time}</p>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-text-tertiary">
                        + 5 hidden tests (revealed after submission)
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Play className="w-5 h-5 text-text-tertiary mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">
                        Run tests to check your solution
                      </p>
                    </div>
                  )}
                </div>
              )}

              {rightTab === "feedback" && (
                <div className="text-center py-8">
                  <MessageSquare className="w-5 h-5 text-text-tertiary mx-auto mb-2" />
                  <p className="text-xs text-text-secondary">
                    Submit your solution to get AI feedback
                  </p>
                </div>
              )}

              {rightTab === "notes" && (
                <textarea
                  className="w-full h-48 text-xs border border-border rounded-lg p-3 bg-bg placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                  placeholder="Add personal notes about this task..."
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-bg-card shrink-0">
          <div className="flex items-center gap-2 text-xs">
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-1.5 text-text-tertiary">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving…
              </span>
            ) : saveStatus === "saved" ? (
              <span className="flex items-center gap-1.5 text-text-tertiary">
                <CheckCircle2 className="w-3 h-3 text-success" /> Last saved 42 seconds ago
              </span>
            ) : (
              <span className="text-warning">
                Unsaved changes in {activeFileDirty ? activeFile : "this workspace"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleRunTests} loading={testsRunning}>
              <Play className="w-3.5 h-3.5" />
              Run tests
            </Button>
            <Button size="sm">
              <Send className="w-3.5 h-3.5" />
              Submit solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

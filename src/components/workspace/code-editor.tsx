"use client";

import Editor, {
  type BeforeMount,
  type Monaco,
  type OnChange,
  type OnMount,
} from "@monaco-editor/react";
import { useCallback } from "react";

const languageByExtension: Record<string, string> = {
  py: "python",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  md: "markdown",
  markdown: "markdown",
  dockerfile: "dockerfile",
};

export function getEditorLanguage(fileName: string, fallback = "plaintext") {
  const lowerName = fileName.toLowerCase();
  if (lowerName === "dockerfile" || lowerName.endsWith(".dockerfile")) return "dockerfile";

  const extension = lowerName.split(".").pop();
  return extension ? (languageByExtension[extension] ?? fallback) : fallback;
}

function configureDockerfileLanguage(monaco: Monaco) {
  const alreadyRegistered = monaco.languages
    .getLanguages()
    .some((language: { id: string }) => language.id === "dockerfile");
  if (alreadyRegistered) return;

  monaco.languages.register({
    id: "dockerfile",
    extensions: [".dockerfile", "Dockerfile"],
    aliases: ["Dockerfile", "dockerfile"],
  });

  monaco.languages.setMonarchTokensProvider("dockerfile", {
    defaultToken: "",
    ignoreCase: true,
    tokenizer: {
      root: [
        [/#.*$/, "comment"],
        [
          /\b(?:FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/,
          "keyword",
        ],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string_double"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'/, "string", "@string_single"],
        [/\$\{?[a-zA-Z_][\w]*\}?/, "variable"],
        [/\d+/, "number"],
      ],
      string_double: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"],
      ],
      string_single: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape"],
        [/'/, "string", "@pop"],
      ],
    },
  });
}

interface CodeEditorProps {
  fileName: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ fileName, value, onChange, readOnly }: CodeEditorProps) {
  const language = getEditorLanguage(fileName);

  const handleBeforeMount = useCallback<BeforeMount>((monaco) => {
    configureDockerfileLanguage(monaco);
  }, []);

  const handleMount = useCallback<OnMount>((editor) => {
    editor.focus();
  }, []);

  const handleChange = useCallback<OnChange>(
    (nextValue) => {
      onChange(nextValue ?? "");
    },
    [onChange]
  );

  return (
    <Editor
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      height="100%"
      language={language}
      path={fileName}
      theme="vs-dark"
      value={value}
      onChange={handleChange}
      options={{
        automaticLayout: true,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
        fontSize: 13,
        lineHeight: 22,
        minimap: { enabled: false },
        padding: { top: 16, bottom: 16 },
        readOnly,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        tabSize: 2,
        wordWrap: "on",
      }}
    />
  );
}

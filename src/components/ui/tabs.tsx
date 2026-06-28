"use client";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, activeTab, onTabChange, className }: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id || "");
  const active = activeTab ?? internalActive;
  const current = tabs.find((t) => t.id === active);

  function selectTab(tabId: string) {
    setInternalActive(tabId);
    onTabChange?.(tabId);
  }

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
              active === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text hover:border-border"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-text-tertiary">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{current?.content}</div>
    </div>
  );
}

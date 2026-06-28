"use client";

import Link from "next/link";
import {
  Code2,
  ArrowRight,
  Terminal,
  GitBranch,
  Shield,
  Database,
  FileCode,
  Bug,
  CheckCircle2,
  Star,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

const categories = [
  { name: "Python Debugging", icon: Bug, count: 24 },
  { name: "Docker", icon: Terminal, count: 18 },
  { name: "Git Workflows", icon: GitBranch, count: 12 },
  { name: "Code Review", icon: FileCode, count: 31 },
  { name: "Security", icon: Shield, count: 15 },
  { name: "Database", icon: Database, count: 20 },
];

const howItWorks = [
  {
    step: "01",
    title: "Pick a task",
    description:
      "Browse real-world debugging, review, and integration tasks across multiple categories and difficulty levels.",
  },
  {
    step: "02",
    title: "Write your solution",
    description:
      "Work in a browser-based code editor with syntax highlighting, file tabs, and auto-save. Run visible tests as you go.",
  },
  {
    step: "03",
    title: "Get AI feedback",
    description:
      "Submit your solution and receive detailed feedback on correctness, readability, edge cases, and maintainability.",
  },
  {
    step: "04",
    title: "Build your portfolio",
    description:
      "Approved tasks appear on your public portfolio. Share it with employers, clients, or open-source maintainers.",
  },
];

const feedbackPreview = {
  score: 84,
  task: "Fix broken Python CSV parser",
  breakdown: [
    { label: "Correctness", score: 36, max: 40 },
    { label: "Edge cases", score: 14, max: 20 },
    { label: "Readability", score: 13, max: 15 },
    { label: "Maintainability", score: 12, max: 15 },
    { label: "Explanation", score: 9, max: 10 },
  ],
  summary:
    "Your solution handles normal CSV files correctly, but it does not handle empty rows or quoted commas. Add validation before splitting each row manually.",
  strengths: [
    "Clean function structure",
    "Good variable naming",
    "Proper file handling with context manager",
  ],
  improvements: [
    "Missing empty row handling",
    "Quoted comma edge case not covered",
    "No input validation for file path",
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-text">SkillBridge AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text transition-colors">
              Features
            </a>
            <a href="#categories" className="hover:text-text transition-colors">
              Tasks
            </a>
            <a href="#feedback" className="hover:text-text transition-colors">
              Feedback
            </a>
            <a href="#portfolio" className="hover:text-text transition-colors">
              Portfolio
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Start practicing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light text-accent text-xs font-medium rounded-full mb-6">
            <Zap className="w-3 h-3" />
            AI-powered code review and feedback
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text leading-tight tracking-tight">
            Practice real software engineering tasks, not just algorithms.
          </h1>
          <p className="mt-5 text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
            Debug Python code, fix Dockerfiles, review AI-generated answers, improve Git workflows,
            and build a verified developer portfolio.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
            >
              Start practicing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tasks/sample"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text bg-bg-card border border-border hover:bg-surface-hover rounded-lg transition-colors"
            >
              View sample task
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" /> 140+ tasks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" /> 11 categories
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Free to start
            </span>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-border bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-text">
              LeetCode tests algorithm knowledge. The real job tests engineering skills.
            </h2>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Most practice platforms focus on data structures and algorithms. But day-to-day
              software engineering involves debugging broken code, reviewing pull requests, fixing
              Docker builds, writing tests, and handling edge cases. SkillBridge AI gives you tasks
              that mirror actual engineering work.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Not toy problems</p>
              <p className="text-sm text-text-secondary">
                Fix a broken CSV parser and explain the edge cases you handled.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Not just pass/fail</p>
              <p className="text-sm text-text-secondary">
                Submit your solution and receive feedback on correctness, readability, edge cases,
                and maintainability.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Not just for interviews</p>
              <p className="text-sm text-text-secondary">
                Approved tasks appear on your public portfolio. Show employers what you can actually
                do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="text-lg font-semibold text-text">How it works</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Four steps from picking a task to building your portfolio.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="space-y-3">
              <span className="text-xs font-bold text-accent tabular-nums">{item.step}</span>
              <h3 className="text-sm font-semibold text-text">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Task Categories */}
      <section id="categories" className="border-y border-border bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="text-lg font-semibold text-text">Task categories</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Real engineering tasks across 11 skill areas.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-border-strong transition-colors bg-bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-border flex items-center justify-center shrink-0">
                  <cat.icon className="w-5 h-5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{cat.name}</p>
                  <p className="text-xs text-text-tertiary">{cat.count} tasks</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 flex-wrap text-xs text-text-tertiary">
            <span>+ JavaScript Debugging</span>
            <span>· API Integration</span>
            <span>· Frontend</span>
            <span>· Backend</span>
            <span>· AI Response Evaluation</span>
          </div>
        </div>
      </section>

      {/* AI Feedback Preview */}
      <section id="feedback" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="text-lg font-semibold text-text">
          Detailed AI feedback on every submission
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Not just pass or fail. Understand what you did well and what to improve.
        </p>
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="bg-bg-card border border-border rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text">{feedbackPreview.task}</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Python · Debugging · Intermediate
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text tabular-nums">{feedbackPreview.score}</p>
                <p className="text-xs text-text-tertiary">/100</p>
              </div>
            </div>
            <div className="space-y-3">
              {feedbackPreview.breakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{item.label}</span>
                    <span className="text-xs font-medium text-text tabular-nums">
                      {item.score}/{item.max}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                AI Summary
              </p>
              <p className="text-sm text-text leading-relaxed">{feedbackPreview.summary}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-medium text-success uppercase tracking-wider mb-2">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {feedbackPreview.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-medium text-warning uppercase tracking-wider mb-2">
                Needs Improvement
              </p>
              <ul className="space-y-1.5">
                {feedbackPreview.improvements.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-4 h-4 shrink-0 mt-0.5 text-warning">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="border-y border-border bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="text-lg font-semibold text-text">A portfolio that proves your skills</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Approved tasks appear on your public profile. Share it with employers and clients.
          </p>
          <div className="mt-8 bg-bg border border-border rounded-xl p-6 max-w-lg">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-accent">JD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Jane Doe</p>
                <p className="text-xs text-text-tertiary">
                  Full-stack developer · 14 approved tasks
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { skill: "Python Debugging", score: 88 },
                { skill: "Code Review", score: 91 },
                { skill: "Docker", score: 76 },
                { skill: "Git Workflows", score: 82 },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{s.skill}</span>
                    <span className="text-xs font-medium text-text tabular-nums">{s.score}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-text-secondary">Reviewer verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviewer Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="text-lg font-semibold text-text">Human reviewers add a second layer</h2>
        <p className="mt-2 text-sm text-text-secondary max-w-xl">
          AI gives instant feedback. Human reviewers verify quality, leave comments, and approve
          tasks for your portfolio.
        </p>
        <div className="mt-8 bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-gray-50/50">
            <p className="text-xs font-medium text-text-secondary">Pending review</p>
          </div>
          <div className="divide-y divide-border">
            {[
              {
                dev: "alex_k",
                task: "Fix Docker multi-stage build",
                cat: "Docker",
                time: "2h ago",
                aiScore: 78,
              },
              {
                dev: "maria_s",
                task: "Debug async Python handler",
                cat: "Python",
                time: "5h ago",
                aiScore: 91,
              },
              {
                dev: "chen_w",
                task: "Review AI-generated REST API",
                cat: "Code Review",
                time: "1d ago",
                aiScore: 85,
              },
            ].map((row) => (
              <div key={row.dev} className="px-5 py-3 flex items-center gap-4 text-sm">
                <span className="font-medium text-text w-24 truncate">{row.dev}</span>
                <span className="text-text-secondary flex-1 truncate">{row.task}</span>
                <span className="text-xs text-text-tertiary hidden sm:block w-24">{row.cat}</span>
                <span className="text-xs text-text-tertiary hidden md:block w-16">{row.time}</span>
                <span className="text-xs font-medium text-text tabular-nums w-12 text-right">
                  AI: {row.aiScore}
                </span>
                <span className="text-xs text-accent font-medium cursor-pointer hover:underline">
                  Review
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-text">
            Start practicing real engineering tasks today
          </h2>
          <p className="mt-3 text-sm text-text-secondary max-w-md mx-auto">
            Pick your first task, write a solution, get AI feedback, and start building a portfolio
            that shows what you can do.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center">
              <Code2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-text">SkillBridge AI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <a href="#" className="hover:text-text transition-colors">
              About
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-text transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-text-tertiary">© 2025 SkillBridge AI</p>
        </div>
      </footer>
    </div>
  );
}

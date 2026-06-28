"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Flame, Target, Zap, Shield, Star, Code2, CheckCircle2, Lock } from "lucide-react";

const earnedBadges = [
  {
    name: "First Submission",
    description: "Submit your first solution",
    icon: Send,
    date: "Jan 15, 2025",
  },
  {
    name: "Python Proficient",
    description: "Complete 5 Python debugging tasks",
    icon: Code2,
    date: "Feb 2, 2025",
  },
  {
    name: "Streak Master",
    description: "Maintain a 5-day streak",
    icon: Flame,
    date: "Mar 1, 2025",
  },
  {
    name: "Reviewer Approved",
    description: "Get 3 tasks approved for portfolio",
    icon: Star,
    date: "Mar 8, 2025",
  },
  { name: "High Scorer", description: "Score 90+ on any task", icon: Target, date: "Mar 10, 2025" },
];

const lockedBadges = [
  {
    name: "Docker Expert",
    description: "Complete 10 Docker tasks",
    icon: Shield,
    progress: "3/10",
  },
  {
    name: "Security Sentinel",
    description: "Score 85+ on 5 security tasks",
    icon: Shield,
    progress: "1/5",
  },
  {
    name: "Speed Demon",
    description: "Complete a task in under 10 minutes",
    icon: Zap,
    progress: "Best: 14 min",
  },
  {
    name: "Perfect Score",
    description: "Score 100 on any task",
    icon: Award,
    progress: "Best: 95",
  },
  {
    name: "Full Stack",
    description: "Complete tasks in all 11 categories",
    icon: Code2,
    progress: "6/11",
  },
];

function Send(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

export default function BadgesPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Badges</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Track your achievements and milestones.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-accent" />
          Earned ({earnedBadges.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {earnedBadges.map((badge) => (
            <Card key={badge.name} padding="md" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-light border border-accent/20 flex items-center justify-center shrink-0">
                <badge.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{badge.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{badge.description}</p>
                <p className="text-xs text-text-tertiary mt-1">{badge.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-text-tertiary" />
          Locked ({lockedBadges.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {lockedBadges.map((badge) => (
            <Card key={badge.name} padding="md" className="flex items-start gap-4 opacity-60">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-border flex items-center justify-center shrink-0">
                <badge.icon className="w-5 h-5 text-text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{badge.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{badge.description}</p>
                <p className="text-xs text-text-tertiary mt-1">Progress: {badge.progress}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

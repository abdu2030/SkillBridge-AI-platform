export interface WeeklyActivityPoint {
  day: string;
  tasks: number;
}

export interface ScoreHistoryPoint {
  label: string;
  score: number;
}

export interface DashboardProgressData {
  completedTasks: number;
  averageScore: number;
  strongestSkill: string;
  weakestSkill: string;
  currentStreak: number;
  pendingFeedback: number;
  weeklyActivity: WeeklyActivityPoint[];
  categoryPerformance: Array<{
    skill: string;
    score: number;
    completedCount: number;
  }>;
  scoreHistory: ScoreHistoryPoint[];
  recentSubmissions: Array<{
    id: string;
    task: string;
    score: number | null;
    status: string;
    time: string;
  }>;
}

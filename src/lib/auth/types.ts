export type AppRole = "developer" | "reviewer" | "admin";

export interface UserProfile {
  id: string;
  fullName: string;
  role: AppRole;
  avatarUrl: string | null;
  email: string | null;
}

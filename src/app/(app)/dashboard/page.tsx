import { DashboardContent } from "@/app/(app)/dashboard/dashboard-content";
import { getCurrentProfile } from "@/lib/auth/server";
import { getProgressDashboardData } from "@/lib/progress/server";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const dashboard = await getProgressDashboardData(profile?.id ?? "");
  const firstName = profile?.fullName.split(" ")[0] ?? "Developer";

  return <DashboardContent dashboard={dashboard} firstName={firstName} />;
}

import { AdminClient } from "@/app/(app)/admin/admin-client";
import { Card, CardTitle } from "@/components/ui/card";
import { requireAdminProfile } from "@/lib/auth/server";

export default async function AdminPage() {
  const admin = await requireAdminProfile();

  if (!admin) {
    return (
      <div className="max-w-xl">
        <Card>
          <CardTitle>Admin access required</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            This area is restricted to admin users. Sign in with an admin account to manage task
            publishing and platform settings.
          </p>
        </Card>
      </div>
    );
  }

  return <AdminClient />;
}

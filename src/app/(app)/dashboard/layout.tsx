import Sidebar from "@/components/dashboard/sidebar";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/sign-in");
  }

  if (
    session.user.role !== "user"
  ) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* Sidebar */}
      <aside className="w-72 border-r bg-card sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>

    </div>
  );
}
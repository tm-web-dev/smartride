import Sidebar from "@/components/dashboard/sidebar";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";

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
    <div className="min-h-screen flex bg-background">

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r bg-card">
        <Sidebar />
      </aside>

      {/* Content */}
      <main className="flex-1">

        {/* Mobile Header */}
        <div className="md:hidden border-b p-4 flex items-center gap-3">
          <MobileSidebar />

          <h1 className="font-semibold">
            SmartRide
          </h1>
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {children}
        </div>

      </main>

    </div>
  );
}
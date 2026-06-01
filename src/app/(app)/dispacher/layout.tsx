import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function DispatcherLayout({
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
    session.user.role !==
    "dispatcher"
  ) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
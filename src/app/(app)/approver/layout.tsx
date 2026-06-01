import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ApproverLayout({
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
    "approver"
  ) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
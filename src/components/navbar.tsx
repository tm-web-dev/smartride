"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  if (pathname.startsWith("/receipt")) {
    return null;
  }

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg">
          SmartRide
        </Link>

        {/* LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {status === "loading" ? null : session ? (
            <>
             <Link
  href={
    session.user.role === "staff" ||
    session.user.role === "admin"
      ? "/staff/applications"
      : "/dashboard"
  }
>
  <Button variant="ghost">
    My Account
  </Button>
</Link>

              <Button
                variant="destructive"
                onClick={() =>
                  signOut({
                    callbackUrl: "/sign-in",
                  })
                }
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">
                  Login
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button>
                  Sign Up
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
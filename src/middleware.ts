import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    const pathname =
      req.nextUrl.pathname;

    // Prevent logged-in users from visiting login/signup
    if (
      token &&
      (
        pathname === "/sign-in" ||
        pathname === "/sign-up"
      )
    ) {
      let redirectUrl =
        "/dashboard";

      if (
        token.role === "admin"
      ) {
        redirectUrl =
          "/admin";
      } else if (
        token.role === "staff"
      ) {
        redirectUrl =
          "/staff/applications";
      }

      return NextResponse.redirect(
        new URL(
          redirectUrl,
          req.url
        )
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({
        token,
        req,
      }) => {
        const pathname =
          req.nextUrl.pathname;

        // Admin pages
        if (
          pathname.startsWith(
            "/admin"
          )
        ) {
          return (
            token?.role ===
            "admin"
          );
        }

        // Staff pages
        if (
          pathname.startsWith(
            "/staff"
          )
        ) {
          return (
            token?.role ===
              "staff" ||
            token?.role ===
              "admin"
          );
        }

        // User dashboard pages
        if (
          pathname.startsWith(
            "/dashboard"
          )
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/staff/:path*",
    "/admin/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
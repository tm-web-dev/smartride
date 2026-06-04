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
      const redirectUrl =
        token.role === "staff" ||
        token.role === "admin"
          ? "/staff/applications"
          : "/dashboard";

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

        // Any dashboard page
        if (
          pathname.startsWith(
            "/dashboard"
          )
        ) {
          return !!token;
        }

        // Any staff page
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

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/staff/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
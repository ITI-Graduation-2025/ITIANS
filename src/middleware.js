import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
// import { getAllUsers } from "./services/firebase";
import { getAllUsers } from "./services/userServices";
import { toast } from "sonner";
// This function can be marked `async` if using `await` inside

export default withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const isAuth = await getToken({ req: request });
    const role = isAuth?.role;
    if (role === "admin") {
      if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }
    const protectedRoutes = [
      "/dashboard",
      "/dashboard/:path*",
      "/mentor",
      "/mentor/:path*",
      "/profile",
      "/profile/:path*",
      "/settings",
      "/mentors",
      "/users",
      "/chat",
      "/chat/:path*",
      "/pending",
      "/rejected",
    ];
    const isAuthRoute = pathname.startsWith("/login");
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname.startsWith(route) || pathname === "/",
    );
    // دي بترجه ترو لو انا ف البروفابل او اي باث بيبدا ب بروفايل
    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const token = await getToken({ req: request });
    const userStatus = token?.verificationStatus;
    const userRole = token?.role;

    if (userStatus === "Pending" && pathname !== "/pending") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }

    if (
      (userStatus === "Rejected" || userStatus === "Suspended") &&
      pathname !== "/rejected"
    ) {
      return NextResponse.redirect(new URL("/rejected", request.url));
    }

    if (isAuthRoute && isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);

// دي الراوت اللي الميدل وير بيتعامل معاها بالفعل
//  ليه path عشان لو في نيستد راوت
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/mentor",
    "/",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/pending",
    "/rejected",
    "/mentorData",
    "/mentors",
    "/users",
    "/chat",
  ],
};

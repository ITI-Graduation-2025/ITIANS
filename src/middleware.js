import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
// import { getAllUsers } from "./services/firebase";
import { getAllUsers } from "./services/userServices";
// This function can be marked `async` if using `await` inside

export default withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const isAuth = await getToken({ req: request });
    const protectedRoutes = ["/dashboard", "/mentor", "/profile", "/mentors"];
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

    if (userStatus === "Pending") {
      // return NextResponse.redirect(new URL("/pending", request.url));
    }

    if (userStatus === "Rejected" || userStatus === "Suspended") {
      return NextResponse.redirect(new URL("/rejected", request.url));
    }

    if (isAuthRoute && isAuth) {
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
    "/pending",
    "/rejected",
    "/mentorData",
    "/mentors",
  ],
};

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

    // فحص إضافي للتوكن
    if (isAuth) {
      // التأكد من أن التوكن صالح
      const tokenExpiry = isAuth.exp * 1000; // تحويل إلى milliseconds
      if (Date.now() > tokenExpiry) {
        console.log("Token expired, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // تسجيل معلومات التوكن للتشخيص
      console.log("Token valid:", {
        userId: isAuth.sub,
        role: isAuth.role,
        verificationStatus: isAuth.verificationStatus,
        exp: new Date(tokenExpiry).toISOString(),
      });
    } else {
      console.log("No valid token found");
    }

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
      "/complete-profile",
    ];
    const isAuthRoute = pathname.startsWith("/login");
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname.startsWith(route) || pathname === "/",
    );

    // Handle port issues by using the current request URL
    const baseUrl = request.nextUrl.origin;

    // دي بترجه ترو لو انا ف البروفابل او اي باث بيبدا ب بروفايل
    if (!isAuth && isProtectedRoute) {
      console.log("Unauthorized access to protected route:", pathname);
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const token = await getToken({ req: request });
    const userStatus = token?.verificationStatus;
    const userRole = token?.role;

    if (userStatus === "Pending" && pathname !== "/pending") {
      console.log("User pending, redirecting to pending page");
      return NextResponse.redirect(new URL("/pending", request.url));
    }

    if (
      (userStatus === "Rejected" || userStatus === "Suspended") &&
      pathname !== "/rejected"
    ) {
      console.log("User rejected/suspended, redirecting to rejected page");
      return NextResponse.redirect(new URL("/rejected", request.url));
    }

    if (isAuthRoute && isAuth) {
      console.log(
        "Authenticated user accessing auth route, redirecting to home",
      );
      return NextResponse.redirect(new URL("/", baseUrl));
    }
    if (pathname.startsWith("/dashboard") && role !== "admin") {
      console.log("Non-admin user accessing dashboard, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Middleware passed for:", pathname);
    return NextResponse.next();
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
    "/complete-profile",
  ],
};

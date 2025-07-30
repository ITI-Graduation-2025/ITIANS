// import { getToken } from "next-auth/jwt";
// import { NextResponse, NextRequest } from "next/server";
// import { withAuth } from "next-auth/middleware";
// // This function can be marked `async` if using `await` inside

// export default withAuth(
//   async function middleware(request) {
//     const pathname = request.nextUrl.pathname;
//     const isAuth = await getToken({ req: request });
//     const protectedRoutes = ["/dashboard", "/mentor", "/profile"];
//     const isAuthRoute = pathname.startsWith("/login");
//     const isProtectedRoute = protectedRoutes.some(
//       (route) => pathname.startsWith(route) || pathname === "/",
//     );
//     // دي بترجه ترو لو انا ف البروفابل او اي باث بيبدا ب بروفايل
//     if (!isAuth && isProtectedRoute) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     if (isAuthRoute && isAuth) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   },
//   {
//     callbacks: {
//       async authorized() {
//         // This is a work-around for handling redirect on auth pages.
//         // We return true here so that the middleware function above
//         // is always called.
//         return true;
//       },
//     },
//   },
// );

// // دي الراوت اللي الميدل وير بيتعامل معاها بالفعل
// //  ليه path عشان لو في نيستد راوت
// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/login",
//     "/register",
//     "/mentor",
//     "/",
//     "/profile",
//   ],
// };
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const token = await getToken({ req: request });
    const protectedRoutes = ["/dashboard", "/mentor", "/profile", "/chat"];
    const isAuthRoute =
      pathname.startsWith("/login") || pathname.startsWith("/register");
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname.startsWith(route) || pathname === "/",
    );

    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token }) {
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/mentor",
    "/",
    "/profile",
    "/chat/:path*",
  ],
};

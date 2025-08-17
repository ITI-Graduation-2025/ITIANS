// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/componentts/Navbar";
// import Footer from "@/components/componentts/Footer";
// import ChatbotWidget from "@/components/ChatbotWidget";

// export default function LayoutWrapper({ children }) {
//   const pathname = usePathname();

//   const hideBothExactPaths = [
//     "/login",
//     "/register",
//     "/mentor",
//     "/dashboardCompany",
//     "/dashboard",
//     "/mentor/[id]",
//     "/chatbot",
//   ];

//   const hideBoth =
//     hideBothExactPaths.includes(pathname) ||
//     pathname.startsWith("/dashboard") ||
//     pathname.startsWith("/mentor/");

//   const hideNavbar = pathname === "/profile";

//   return (
//     <>
//       {!hideBoth && !hideNavbar && <Navbar />}
//       {children}
//       {!hideBoth && <Footer />}
//       <ChatbotWidget />
//     </>
//   );
// }
/////////////////////////////
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/componentts/Navbar";
import Footer from "@/components/componentts/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideBothExactPaths = [
    "/login",
    "/register",
    "/mentor",
    "/dashboardCompany",
    "/dashboard",
    "/mentor/[id]",
    "/pending",
    "/rejected",
    "/bookings",
  ];

  const hideBoth =
    hideBothExactPaths.includes(pathname) ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mentor/") ||
    pathname.startsWith("/rejected");

  // Specific path where only navbar is hidden
  const hideNavbar = pathname === "/profile" || pathname === "/community";

  return (
    <>
      {!hideBoth && !hideNavbar && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideBoth && <Footer />}

      {/* Show chatbot on all pages except specific paths */}
      {!pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        pathname !== "/chatbot" && <ChatbotWidget />}
    </>
  );
} //Paths where both navbar and footer are hidden
const hideBothExactPaths = [
  "/login",
  "/register",
  "/mentor",
  "/dashboardCompany",
  "/dashboard",
  "/mentor/[id]",
  "/chatbot",
];

//

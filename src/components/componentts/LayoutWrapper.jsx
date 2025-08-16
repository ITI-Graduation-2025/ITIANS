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
    "/chatbot",
  ];

  const hideBoth =
    hideBothExactPaths.includes(pathname) ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mentor/");

  const hideNavbar = pathname === "/profile";

  return (
    <>
      {!hideBoth && !hideNavbar && <Navbar />}
      {children}
      {!hideBoth && <Footer />}
      <ChatbotWidget />
    </>
  );
}

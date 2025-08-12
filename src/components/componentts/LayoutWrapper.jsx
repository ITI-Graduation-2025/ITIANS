"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/componentts/Navbar";
import Footer from "@/components/componentts/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideBothExactPaths = [
    "/login",
    "/register",
    "/mentor",
    "/dashboardCompany",
    "/dashboard",
    "/pending",
    "/rejected",
    "/companyjobs",
    "/AllCompanyApplicants",
    "/companyprofile",
    "/ProfileViewCom",
  ];

  const hideBoth =
    hideBothExactPaths.includes(pathname) ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mentor/") ||
    pathname.startsWith("/rejected") ||
    pathname.startsWith("/Applicationjob/");

  const hideNavbar = pathname === "/profile";

  return (
    <>
      {!hideBoth && !hideNavbar && <Navbar />}
      {children}
      {!hideBoth && <Footer />}
    </>
  );
}


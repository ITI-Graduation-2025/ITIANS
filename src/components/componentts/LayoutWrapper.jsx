"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/componentts/Navbar";
import Footer from "@/components/componentts/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hiddenPaths = ["/login", "/register"];

  const hideLayout = hiddenPaths.includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

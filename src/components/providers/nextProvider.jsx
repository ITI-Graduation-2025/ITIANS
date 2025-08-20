"use client";
import { UsersProvider } from "@/context/usersContext";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import { cleanupAllListeners } from "@/config/firebase";

export default function NextProvider({ children }) {
  // تنظيف المستمعين عند تغيير الجلسة
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "next-auth.session-token" ||
        e.key === "next-auth.csrf-token"
      ) {
        console.log("Session changed, cleaning up listeners");
        cleanupAllListeners();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <SessionProvider
      refetchInterval={5 * 60} // تحديث كل 5 دقائق
      refetchOnWindowFocus={true} // تحديث عند التركيز
      refetchWhenOffline={false} // لا تحديث عند عدم وجود إنترنت
    >
      {children}
    </SessionProvider>
  );
}

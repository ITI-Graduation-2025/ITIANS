"use client";
import { UsersProvider } from "@/context/usersContext";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function NextProvider({ children }) {
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

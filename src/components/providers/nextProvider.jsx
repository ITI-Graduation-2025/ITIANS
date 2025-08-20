"use client";
import { UsersProvider } from "@/context/usersContext";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function NextProvider({ children }) {
  return (
    <SessionProvider
      refetchInterval={0} // إيقاف التحديث التلقائي
      refetchOnWindowFocus={false} // إيقاف التحديث عند التركيز
      refetchWhenOffline={false} // لا تحديث عند عدم وجود إنترنت
    >
      {children}
    </SessionProvider>
  );
}

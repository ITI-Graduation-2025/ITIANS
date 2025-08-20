"use client";
import { UsersProvider } from "@/context/usersContext";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import { cleanupAllListeners } from "@/config/firebase";

export default function NextProvider({ children }) {
  // تم تعطيل تنظيف المستمعين التلقائي المعتمد على تخزين المتصفح لتفادي قطع اتصال Firestore المتكرر

  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

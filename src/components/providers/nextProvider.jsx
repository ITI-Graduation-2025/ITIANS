"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function NextProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

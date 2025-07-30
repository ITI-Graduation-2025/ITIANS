"use client";
import { UsersProvider } from "@/context/usersContext";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function NextProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

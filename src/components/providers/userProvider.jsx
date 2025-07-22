"use client";
import { UsersProvider } from "@/context/usersContext";
import { UserProvider } from "@/context/userContext";
import React from "react";

export default function UserProvider({ children }) {
  return (
    <UsersProvider>
      <UserProvider>{children}</UserProvider>
    </UsersProvider>
  );
}

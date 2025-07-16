"use client";
import { UsersProvider } from "@/context/usersContext";
import React from "react";

export default function UserProvider({ children }) {
  return <UsersProvider>{children}</UsersProvider>;
}

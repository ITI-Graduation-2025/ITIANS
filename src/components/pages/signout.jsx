"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

export default function Signout() {
  return (
    <button
      type="button"
      onClick={() => {
        signOut({ callbackUrl: "/login" });
        toast.success("Logged out successfully!");
      }}
      className="bg-[#B71C1C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#B71C1C]/90 transition-colors"
    >
      Sign Out
    </button>
  );
}

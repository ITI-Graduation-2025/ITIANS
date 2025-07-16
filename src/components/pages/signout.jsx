"use client";
import { signOut } from "next-auth/react";
import React from "react";

export default function Signout() {
  return (
    <button type="button" onClick={() => signOut()}>
      signout
    </button>
  );
}

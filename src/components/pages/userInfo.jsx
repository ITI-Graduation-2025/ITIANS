"use client";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import React from "react";
import Signout from "./signout";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function UserInfo() {
  const { data, status } = useSession();
  console.log(data);

  const [showStatusBar, setShowStatusBar] = React.useState(false);
  const [showActivityBar, setShowActivityBar] = React.useState(false);
  const [showPanel, setShowPanel] = React.useState(false);

  return (
    <div>
      {status === "loading" && <div>loading...</div>}
      {status === "unauthenticated" && <Link href="/login">Login</Link>}
      {status === "authenticated" && (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>{data.user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Status Bar
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
                onClick={() => signOut()}
              >
                signout
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle, FaSignOutAlt, FaRegUser } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function UserInfo() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Link
        href="/login"
        className="bg-white text-[#B71C1C] px-3 py-1 rounded hover:bg-gray-100"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-white hover:text-[#E57373] hover:bg-transparent"
          >
            <FaUserCircle className="w-6 h-6" />
            <span>{data.user.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-white text-[#B71C1C] border-none shadow-lg"
        >
          <DropdownMenuItem
            asChild
            className="group flex items-center gap-4 cursor-pointer hover:bg-[#B71C1C] hover:text-white"
          >
            <Link href="/profile" className="flex items-center gap-3">
              <FaRegUser className="text-[#B71C1C] group-hover:text-white" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut()}
            className="group flex items-center gap-4 cursor-pointer hover:bg-[#B71C1C] hover:text-white"
          >
            <FaSignOutAlt className="text-[#B71C1C] group-hover:text-white" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

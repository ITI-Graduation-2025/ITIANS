"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useUserContext } from "@/context/userContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function UserDropdown() {
  const { user } = useUserContext();
  const name = user?.name || user?.fullName || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
          type="button"
        >
          {/* أيقونة جنب الاسم مباشرة */}
          <User size={20} className="text-gray-600" />

          <span className="text-gray-800 font-medium">{name}</span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <Link href="/ProfileViewCom">
          <DropdownMenuItem className="cursor-pointer">
            <User size={16} />
            My Profile
          </DropdownMenuItem>
        </Link>

        <Link href="/settingsform">
          <DropdownMenuItem className="cursor-pointer">
            <Settings size={16} />
            Settings
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer text-red-600"
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



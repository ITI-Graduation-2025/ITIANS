"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaRegUser,
  FaUsers,
  FaComments,
} from "react-icons/fa";
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
            className="flex items-center space-x-2 text-[#B71C1C] hover:text-[var(--primary)] hover:bg-transparent"
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
            <Link
              href={data.user.role === "mentor" ? "/mentor" : "/profile"}
              className="flex items-center gap-3"
            >
              <FaRegUser className="text-[#B71C1C] group-hover:text-white" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            asChild
            className="group flex items-center gap-4 cursor-pointer hover:bg-[#B71C1C] hover:text-white"
          >
            <Link href="/users" className="flex items-center gap-3">
              <FaUsers className="text-[#B71C1C] group-hover:text-white" />
              <span>Users</span>
            </Link>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem
            asChild
            className="group flex items-center gap-4 cursor-pointer hover:bg-[#B71C1C] hover:text-white"
          > */}
          {/* <Link href="/chat" className="flex items-center gap-3">
              <FaComments className="text-[#B71C1C] group-hover:text-white" />
              <span>Messages</span>
            </Link>
          </DropdownMenuItem> */}

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
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaSignOutAlt, FaRegUser, FaUsers, FaComments } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

// Default avatars based on role
const getDefaultAvatar = (role) => {
  switch (role) {
    case "mentor":
      return (
        <img
          src="/default-avatar.avif"
          alt="Default Mentor Avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#B71C1C] transition-colors"
        />
      );
    case "company":
      return (
        <img
          src="/default-logo.avif"
          alt="Default Company Logo"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#B71C1C] transition-colors"
        />
      );
    case "freelancer":
    default: // freelancer or any other role
      return (
        <img
          src="/default--avatar.avif"
          alt="Default Freelancer Avatar"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#B71C1C] transition-colors"
        />
      );
  }
};

export default function UserInfo() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
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
            className="flex items-center space-x-2 text-gray-800 hover:text-[#B71C1C] hover:bg-transparent"
          >
            {/* Profile Image or Default Avatar */}
            {data.user.image ? (
              <img
                src={data.user.image}
                alt={data.user.name || "User"}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#B71C1C] transition-colors"
              />
            ) : (
              getDefaultAvatar(data.user.role || "freelancer")
            )}
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
            <Link
              href={data.user.role === "mentor" ? "/mentor" : "/profile"}
              className="flex items-center gap-3"
            >
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

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useUserContext } from "@/context/userContext";

export default function Dropdowncom() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const avatar = user?.avatar || user?.profileImage || "https://i.pravatar.cc/100?img=5";
  const name = user?.name || user?.fullName || "User";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
      >
       
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
            <User size={16} />
            My Profile
          </a>
          <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
            <Settings size={16} />
            Settings
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left font-semibold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

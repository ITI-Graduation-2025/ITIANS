"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

export default function Dropdowncom() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
        type="button"
      >
        <User size={20} className="text-gray-700" />
        <span className="text-gray-800 font-medium">Admin</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 w-48"
          role="menu"
          aria-label="User menu"
        >
          <Link
            href="/ProfileViewCom"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User size={16} />
            My Profile
          </Link>

          <Link
            href="/settingsform"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} />
            Settings
          </Link>

          <Link
            href="/login"
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

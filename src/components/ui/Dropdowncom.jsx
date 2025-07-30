"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, User, Settings, LogOut } from "lucide-react"; 

export default function Dropdowncom() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
      >
        <Image
          src="data:image/jpeg;base64,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" // Default user avatar
          alt="User"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
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
          <a
            href="/logout"
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

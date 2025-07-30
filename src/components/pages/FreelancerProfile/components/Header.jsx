"use client";

import { useState } from "react";
import ProfileDropdown from "@/components/ui/Dropdowncom";

export const Header = ({ profileImage, fullName, email }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9afXVML2UMaMFwb3fzaIxlIxIlm2EkVefeQ&s"
          alt="ITI"
          className="h-10"
        />
        <nav className="flex gap-6 text-sm text-gray-700">
          <a href="#" className="text-[#B71C1C] font-medium hover:underline">
            Find Work
          </a>
          <a href="#" className="hover:text-[#B71C1C] hover:underline">
            My Jobs
          </a>
          <a href="#" className="hover:text-[#B71C1C] hover:underline">
            Messages
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-2 relative">
        <img
          src={profileImage}
          alt={fullName}
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        <div>
          <p className="text-sm font-medium">{fullName}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>

        {showDropdown && (
          <div className="absolute top-10 right-0 z-50">
            <ProfileDropdown />
          </div>
        )}
      </div>
    </header>
  );
};

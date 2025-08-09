"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Messages", href: "/messages", icon: MessageCircle },
];

function Dropdowncom() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
      >
        <User size={20} className="text-gray-700" />
        <span className="text-gray-800 font-medium">Admin</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 w-48">
          <Link
            href="/dashboardCompany"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User size={16} />
            My dashboard
          </Link>
          <Link
            href="/settingsform"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavbarProfileCom() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={30}
          height={30}
        />
      </div>

      <div className="flex space-x-4 items-center text-sm font-medium">
        {tabs.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-[#E30613]/10 text-[#E30613] font-semibold ring-1 ring-[#E30613]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#E30613]"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </div>

      <Dropdowncom />
    </nav>
  );
}


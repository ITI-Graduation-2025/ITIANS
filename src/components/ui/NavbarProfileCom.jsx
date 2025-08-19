"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { MdWork, MdSchool, MdPeople, MdChat } from "react-icons/md";
import { signOut } from "next-auth/react";
import { ChevronDown, User, Settings, LogOut, Bell } from "lucide-react";
import { useUserContext } from "@/context/userContext";
import UserInfo from "../pages/userInfo";


import {
  listenToNotifications,
  markNotificationAsRead,
  deleteOldNotifications,
} from "@/services/notificationService";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: "Jobs", href: "/jobs", icon: <MdWork className="w-6 h-6" /> },
  { name: "Mentors", href: "/mentors", icon: <MdSchool className="w-6 h-6" /> },
  { name: "Users", href: "/users", icon: <MdPeople className="w-6 h-6" /> },
  { name: "Messages", href: "/chat", icon: <MdChat className="w-6 h-6" /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserContext();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user?.id) return;

    
    deleteOldNotifications(user.id);

    
    const unsubscribe = listenToNotifications(user.id, (newNotifications) => {
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const handleMarkAsRead = async (id, relatedId, type) => {
    await markNotificationAsRead(id);
    
  };

  const avatar =
    user?.avatar || user?.profileImage || "https://i.pravatar.cc/100?img=5";
  const name = user?.name || user?.fullName || "User";

  return (
    <nav className="bg-white text-gray-800 font-semibold shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ITIANS Logo"
            className="h-16 w-16 rounded-full"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-base text-gray-800 hover:text-[#B71C1C] transition-colors duration-200 ml-12">
              Explore
              <FaChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200 shadow-lg rounded-lg w-80">
              <div className="grid grid-cols-2 gap-6 p-4">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link
                      href={category.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm bg-gray-50 hover:bg-[#B71C1C] hover:text-white transition-colors duration-200 rounded-lg"
                    >
                      {category.icon}
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-6">
            {/* Notification Icon */}
            <div className="relative">
              <Bell
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#B71C1C] transition-colors"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}

              {isNotificationOpen && (
                <div className="fixed right-4 mt-2 w-64 bg-white shadow-lg rounded-lg z-[99999] border border-gray-200 max-h-[16rem] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${
                          notification.read ? "bg-gray-50" : "bg-white"
                        } cursor-pointer hover:bg-gray-50 transition-colors`}
                        onClick={() =>
                          handleMarkAsRead(
                            notification.id,
                            notification.relatedId,
                            notification.type
                          )
                        }
                      >
                        <p className="text-sm text-gray-800">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.createdAt &&
                            new Date(
                              notification.createdAt.toDate()
                            ).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
                  type="button"
                >
                   <User size={18} className="text-gray-600" />
                  <span className="text-gray-800 font-medium">{name}</span>
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48" align="end">
                <Link href="/dashboardCompany">
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={16} />
                    My Dashboard
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
          </div>
        </div>

        {/* User Info for small devices */}
        <div className="text-gray-800 hover:text-[#B71C1C] transition-colors duration-200 md:hidden">
          <UserInfo />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
    </nav>
  );
}


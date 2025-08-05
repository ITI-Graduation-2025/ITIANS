"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle, FaSignOutAlt, FaRegUser } from "react-icons/fa";
import { Loader2, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import {
  listenToNotifications,
  updateNotification,
  deleteOldNotifications,
} from "@/services/notificationService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function UserInfo() {
  const { data, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Notification system
  useEffect(() => {
    if (data?.user?.id) {
      deleteOldNotifications(data.user.id);

      const unsubscribe = listenToNotifications(
        data.user.id,
        (notifications) => {
          setNotifications(notifications);
        },
      );
      return () => unsubscribe();
    }
  }, [data?.user?.id]);

  const handleMarkAsRead = async (
    notificationId,
    sessionId,
    notificationType,
  ) => {
    await updateNotification(notificationId, { read: true });
    setIsNotificationOpen(false);

    // If this is an admin action notification, log out immediately
    const notification = notifications.find((n) => n.id === notificationId);
    if (
      notification &&
      [
        "account_approved",
        "profile_approved",
        "account_rejected",
        "profile_rejected",
        "account_suspended",
      ].includes(notification.type)
    ) {
      signOut({ callbackUrl: "/login" });
      return;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <div className="flex items-center space-x-3">
      {/* Notification Bell */}
      <div className="relative">
        <Bell
          className="w-6 h-6 text-white cursor-pointer hover:text-[#E57373] transition-colors"
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
                      notification.type,
                    )
                  }
                >
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.createdAt &&
                      new Date(
                        notification.createdAt.toDate(),
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
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-white hover:text-[#E57373] hover:bg-transparent"
          >
            <FaUserCircle className="w-6 h-6" />
            <span>{data?.user?.name || "User"}</span>
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
              href={data?.user?.role === "mentor" ? "/mentor" : "/profile"}
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

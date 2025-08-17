"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  listenToNotifications,
  updateNotification,
  deleteOldNotifications,
} from "@/services/notificationService";
import { FaSignOutAlt, FaRegUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserInfoSkeleton } from "../ui/user-info-skeleton";
import { useRouter } from "next/navigation";

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
    default:
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
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();

  // Memoized values
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const userAvatar = useMemo(() => {
    console.log("User data:", data?.user);
    console.log("Profile image:", data?.user?.profileImage);

    if (data?.user?.profileImage) {
      return (
        <img
          src={data.user.profileImage}
          alt={data.user.name || "User"}
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#B71C1C] transition-colors"
        />
      );
    }
    return getDefaultAvatar(data?.user?.role || "freelancer");
  }, [data?.user?.profileImage, data?.user?.role, data?.user?.name]);

  const profileLink = useMemo(() => {
    if (data?.user?.role === "mentor") {
      return `/mentor/${data?.user?.id}`;
    } else if (data?.user?.role === "company") {
      return `/companies/${data?.user?.id}`;
    } else if (data?.user?.role === "admin") {
      return `/dashboard`;
    } else {
      return `/profile/${data?.user?.id}`;
    }
  }, [data?.user?.role, data?.user?.id]);

  // Memoized callbacks
  const handleNotificationsUpdate = useCallback((notifications) => {
    setNotifications(notifications);
  }, []);

  // const handleMarkAsRead = useCallback(
  //   async (notificationId, sessionId, notificationType) => {
  //     await updateNotification(notificationId, { read: true });
  //     setIsNotificationOpen(false);

  //     const notification = notifications.find((n) => n.id === notificationId);
  //     if (
  //       notification &&
  //       [
  //         "account_approved",
  //         "profile_approved",
  //         "account_rejected",
  //         "profile_rejected",
  //         "account_suspended",
  //       ].includes(notification.type)
  //     ) {
  //       signOut({ callbackUrl: "/login" });
  //       return;
  //     }
  //   },
  //   [notifications],
  // );

  const handleMarkAsRead = async (
    notificationId,
    sessionId,
    notificationType,
  ) => {
    await updateNotification(notificationId, { read: true });
    setIsNotificationOpen(false);
    if (sessionId) {
      if (notificationType === "session_cancelled") {
        toast.success("Session has been cancelled !.");
      } else {
        router.push(`/session/${sessionId}`);
      }
    }
  };

  const toggleNotification = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  // Notification system
  useEffect(() => {
    if (data?.user?.id) {
      deleteOldNotifications(data.user.id);

      const unsubscribe = listenToNotifications(
        data.user.id,
        handleNotificationsUpdate,
      );
      return () => unsubscribe();
    }
  }, [data?.user?.id, handleNotificationsUpdate]);

  // Show skeleton while loading
  if (status === "loading") {
    return <UserInfoSkeleton />;
  }

  // Show login button if not authenticated
  if (status === "unauthenticated" || !data?.user) {
    return (
      <Link
        href="/login"
        className="bg-white text-[#B71C1C] px-3 py-1 rounded hover:bg-gray-100"
      >
        Login
      </Link>
    );
  }

  // Show skeleton if user data is incomplete
  if (!data.user.id || !data.user.name) {
    return <UserInfoSkeleton />;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Notification Bell */}
      <div className="relative">
        <Bell
          className="w-6 h-6 text-gray cursor-pointer hover:text-[#E57373] transition-colors"
          onClick={toggleNotification}
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
                      new Date(notification.createdAt).toLocaleString()}
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
            className="flex items-center space-x-2 text-gray-800 hover:text-[#B71C1C] hover:bg-transparent"
          >
            {userAvatar}
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
            <Link href={profileLink} className="flex items-center gap-3">
              <FaRegUser className="text-[#B71C1C] group-hover:text-white" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSignOut}
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

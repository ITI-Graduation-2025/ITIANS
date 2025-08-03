"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  listenToNotifications,
  updateNotification,
  deleteOldNotifications, // استيراد الوظيفة الجديدة
} from "@/services/notificationService";
import { Search, ChevronDown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCurrentUser from "@/hooks/useCurrentUser";
import { toast } from "sonner";

export function Header() {
  const user = useCurrentUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      deleteOldNotifications(user.uid);

      const unsubscribe = listenToNotifications(user.uid, (notifications) => {
       
        setNotifications(notifications);
      });
      return () => unsubscribe();
    }
  }, [user]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="border-b bg-[var(--card)] sticky top-0 z-[9999]">
      <div className="flex flex-col gap-4 md:gap-1 md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[var(--foreground)] rounded-full flex items-center justify-center">
            <span className="text-[var(--card-foreground)] text-sm font-bold">
              😊
            </span>
          </div>
          <span className="text-xl font-bold text-[var(--foreground)]">
            ITIANS
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Button
            variant="ghost"
            className="flex items-center justify-between sm:justify-start space-x-1 text-[var(--muted-foreground)]"
          >
            <span>Browse</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
            <Input
              placeholder="Search mentors"
              className="pl-10 w-full sm:max-w-xs sm:w-80 bg-[var(--muted)] border-[var(--border)] rounded-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="relative z-50">
            <Bell
              className="w-6 h-6 text-[var(--muted-foreground)] cursor-pointer"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[var(--destructive)] text-[var(--destructive-foreground)] text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </div>
            )}
            {isNotificationOpen && (
              <div className="fixed right-4 mt-2 w-64 bg-[var(--card)] shadow-lg rounded-lg z-[99999] border border-[var(--border)] max-h-[16rem] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--muted-foreground)] scrollbar-track-[var(--card)]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-[var(--muted-foreground)]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${
                        notification.read
                          ? "bg-[var(--muted)]"
                          : "bg-[var(--card)]"
                      } cursor-pointer hover:bg-[var(--muted)]/50 transition-colors`}
                      onClick={() =>
                        handleMarkAsRead(
                          notification.id,
                          notification.relatedId,
                          notification.type,
                        )
                      }
                    >
                      <p className="text-sm text-[var(--foreground)]">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
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
          <Button
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap"
            onClick={() => router.push("/mentor/sessions")}
          >
            <span>📅</span>
            <span>Book session</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bell,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Mail,
  User,
} from "lucide-react";
import {
  listenToNotifications,
  updateNotification,
  deleteOldNotifications,
} from "@/services/notificationService";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/context/userContext";

export default function RejectedPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Notification system
  useEffect(() => {
    if (user?.id) {
      console.log("🔧 Setting up notification listener for user:", user.id);
      deleteOldNotifications(user.id);

      const unsubscribe = listenToNotifications(user.id, (notifications) => {
        console.log("📥 Received notifications:", notifications.length);
        setNotifications(notifications);

        // Check for admin action notifications
        const adminNotifications = notifications.filter(
          (n) =>
            !n.read &&
            ["account_suspended", "account_rejected"].includes(n.type),
        );

        if (adminNotifications.length > 0) {
          console.log("🎉 Admin action detected, showing notification");
          const notification = adminNotifications[0];
          console.log("🔍 Notification type:", notification?.type);
          console.log("🔍 Notification message:", notification?.message);

          if (notification.type === "account_suspended") {
            toast.error(
              "Your account has been suspended for 7 days due to inappropriate behavior or other reasons. The next violation may result in a longer suspension.",
              {
                duration: 5000,
                action: {
                  label: "Log out",
                  onClick: () => handleLogout(),
                },
              },
            );
          } else if (notification.type === "account_rejected") {
            toast.error(
              "Your account has been rejected. Please contact support for more details.",
              {
                duration: 5000,
                action: {
                  label: "Log out",
                  onClick: () => handleLogout(),
                },
              },
            );
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId) => {
    await updateNotification(notificationId, { read: true });
    setIsNotificationOpen(false);

    const notification = notifications.find((n) => n.id === notificationId);
    if (
      notification &&
      ["account_suspended", "account_rejected"].includes(notification.type)
    ) {
      toast.info(
        "Please log out and contact support if you have any questions.",
        {
          duration: 5000,
          action: {
            label: "Log out",
            onClick: () => handleLogout(),
          },
        },
      );
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing data...");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleContactSupport = () => {
    // يمكنك استبدال هذا برابط الدعم أو دالة لفتح نموذج الدعم
    window.location.href = "mailto:support@example.com";
  };

  const handleAppealSuspension = () => {
    // يمكنك استبدال هذا برابط أو دالة لطلب مراجعة الحظر
    toast.info("Appeal form will be available soon. Please contact support.");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Notification Header */}
      <div className="bg-card shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-destructive-foreground text-sm font-bold">
                🚫
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Account Suspended
              </h1>
              <p className="text-sm text-muted-foreground">
                Your account has been temporarily suspended.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <div className="relative z-50">
              <Bell
                className="w-6 h-6 text-muted-foreground cursor-pointer"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
              {isNotificationOpen && (
                <div className="fixed right-4 mt-2 w-64 bg-card shadow-lg rounded-lg z-[99999] border border-border max-h-[16rem] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${
                          notification.read ? "bg-muted" : "bg-card"
                        } cursor-pointer hover:bg-muted transition-colors`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <p className="text-sm text-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Suspension Reason Card */}
          <Card className="shadow-lg border-l-4 border-l-destructive">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <div>
                  <CardTitle className="text-xl">Account Suspension</CardTitle>
                  <CardDescription className="text-base">
                    Your account has been suspended for 7 days due to
                    inappropriate behavior or other reasons.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="border-destructive text-destructive"
                >
                  Suspended
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Next violation may result in a longer suspension or permanent
                  ban.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {user?.fullName || user?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">
                    {user?.role === "mentor"
                      ? "Mentor"
                      : user?.role === "freelancer"
                        ? "Freelancer"
                        : user?.role === "company"
                          ? "Company"
                          : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Registration Date
                  </p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suspension Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span>Suspension Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Suspension Reason</p>
                    <p className="text-sm text-muted-foreground">
                      Your account was suspended due to inappropriate behavior
                      or violation of our terms of service.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Suspension Duration</p>
                    <p className="text-sm text-muted-foreground">
                      The suspension will last for 7 days, starting from the
                      date of the suspension.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Next Steps</p>
                    <p className="text-sm text-muted-foreground">
                      Please review our terms of service. Further violations may
                      lead to a longer suspension or permanent ban.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="bg-muted border-muted">
            <CardHeader>
              <CardTitle className="text-foreground">
                Available Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance or to appeal the
                    suspension.
                  </p>
                  <Button
                    onClick={handleContactSupport}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Request a review of your suspension.
                  </p>
                  <Button
                    onClick={handleAppealSuspension}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Appeal Suspension
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Log out to refresh your session.
                  </p>
                  <Button
                    onClick={handleLogout}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

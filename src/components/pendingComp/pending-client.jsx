"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, RefreshCw, LogOut } from "lucide-react";
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
import { Clock, User, FileText, AlertCircle, CheckCircle } from "lucide-react";

export function PendingClient({ user }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  // Notification system
  useEffect(() => {
    console.log("🔄 useEffect triggered with user.id:", user?.id);
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
            [
              "account_approved",
              "profile_approved",
              "account_rejected",
              "profile_rejected",
              "account_suspended",
            ].includes(n.type),
        );

        if (adminNotifications.length > 0) {
          console.log("🎉 Admin action detected, showing notification");

          // تحقق من نوع النوتفيكيشن
          const notification = adminNotifications[0]; // أول نوتفيكيشن
          console.log("🔍 Notification type:", notification?.type);
          console.log("🔍 Notification message:", notification?.message);

          if (notification.type === "profile_approved") {
            // موافقة على البروفايل - redirect حسب نوع المستخدم
            const redirectPath =
              user?.role === "mentor" ? "/mentor" : "/profile";
            toast.success(
              "Profile approved! You can now access your profile.",
              {
                duration: 3000,
                action: {
                  label: "Go to Dashboard",
                  onClick: () => router.push(redirectPath),
                },
              },
            );
            // redirect حسب نوع المستخدم بعد ثانيتين
            setTimeout(() => {
              router.push(redirectPath);
            }, 2000);
          } else if (notification.type === "account_approved") {
            // موافقة على الحساب - logout
            setShowLogoutPrompt(true);
            toast.success(
              "Account approved! Please log out and log in again to refresh your data.",
              {
                duration: 5000,
                action: {
                  label: "Log out",
                  onClick: () => handleLogout(),
                },
              },
            );
          } else if (notification.type === "profile_rejected") {
            // رفض البروفايل - logout
            setShowLogoutPrompt(true);
            toast.error("Profile rejected. Please log out and log in again.", {
              duration: 5000,
              action: {
                label: "Log out",
                onClick: () => handleLogout(),
              },
            });
          } else if (notification.type === "account_rejected") {
            // رفض الحساب - logout
            setShowLogoutPrompt(true);
            toast.error("Account rejected. Please log out and log in again.", {
              duration: 5000,
              action: {
                label: "Log out",
                onClick: () => handleLogout(),
              },
            });
          } else if (notification.type === "account_suspended") {
            // تعليق الحساب - logout
            setShowLogoutPrompt(true);
            toast.error("Account suspended. Please log out and log in again.", {
              duration: 5000,
              action: {
                label: "Log out",
                onClick: () => handleLogout(),
              },
            });
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user?.id]); // استخدم user.id بدلاً من array فارغ

  const handleMarkAsRead = async (
    notificationId,
    sessionId,
    notificationType,
  ) => {
    await updateNotification(notificationId, { read: true });
    setIsNotificationOpen(false);

    // Check if this is an admin action notification
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
      setShowLogoutPrompt(true);
      toast.success(
        "Your account status has been updated! Please log out and log in again to refresh your data.",
        {
          duration: 5000,
          action: {
            label: "Log out",
            onClick: () => handleLogout(),
          },
        },
      );
      return;
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getStatusInfo = () => {
    if (user?.verificationStatus === "Pending") {
      return {
        title: "Your account is under review",
        description: "Your information will be reviewed by the admin soon.",
        icon: <Clock className="w-6 h-6 text-orange-500" />,
        color: "orange",
        badge: "Under Review",
      };
    } else if (user?.profileUnderReview) {
      return {
        title: "Profile is under review",
        description: "Your profile will be reviewed by the admin.",
        icon: <FileText className="w-6 h-6 text-blue-500" />,
        color: "blue",
        badge: "Profile Review",
      };
    } else {
      return {
        title: "Unknown status",
        description: "Please contact support.",
        icon: <AlertCircle className="w-6 h-6 text-gray-500" />,
        color: "gray",
        badge: "Unknown",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⏳</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Waiting for Approval
              </h1>
              <p className="text-sm text-gray-600">
                Your account is being reviewed by the admin.
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
                className="w-6 h-6 text-gray-600 cursor-pointer"
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Card */}
          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center space-x-3">
                {statusInfo.icon}
                <div>
                  <CardTitle className="text-xl">{statusInfo.title}</CardTitle>
                  <CardDescription className="text-base">
                    {statusInfo.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`border-${statusInfo.color}-500 text-${statusInfo.color}-600`}
                >
                  {statusInfo.badge}
                </Badge>
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
                      ? new Date(user).toLocaleDateString("en-US")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>What happens next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Data Review</p>
                    <p className="text-sm text-muted-foreground">
                      Our admin team will review your data for accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Approval Notification</p>
                    <p className="text-sm text-muted-foreground">
                      You will receive a notification at the top when your
                      account is approved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Log out and log in again</p>
                    <p className="text-sm text-muted-foreground">
                      Click the notification to log out and log in again to
                      refresh your data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Important Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>
                  • You can click the "Refresh" button to check your account
                  status.
                </li>
                <li>• Watch for notifications at the top for updates.</li>
                <li>• Make sure all your data is accurate.</li>
                <li>• If you have any issues, contact support.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Logout Prompt */}
          {showLogoutPrompt && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Status Updated!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4">
                  Your account status has been updated! Please log out and log
                  in again to refresh your data.
                </p>
                <Button
                  onClick={handleLogout}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

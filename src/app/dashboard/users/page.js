"use client";

import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateUser } from "@/services/userServices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Ban,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Image from "next/image";
import { getAllUsers } from "@/services/userServices";
import { UsersContext } from "@/context/usersContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDetailsModal from "@/components/ui/user-details-modal";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table, grid, cards
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { users, setUsers } = useContext(UsersContext);

  const router = useRouter();

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user?.verificationStatus === "Approved",
  ).length;
  const pendingUsers = users.filter(
    (user) => user?.verificationStatus === "Pending",
  ).length;
  const rejectedUsers = users.filter(
    (user) => user?.verificationStatus === "Rejected",
  ).length;
  const suspendedUsers = users.filter(
    (user) => user?.verificationStatus === "Suspended",
  ).length;

  // Add profile under review statistics
  const profileUnderReviewUsers = users.filter(
    (user) =>
      user?.verificationStatus === "Approved" && user?.profileUnderReview,
  ).length;

  const freelancers = users.filter(
    (user) => user?.role?.toLowerCase() === "freelancer",
  ).length;
  const companies = users.filter(
    (user) => user?.role?.toLowerCase() === "company",
  ).length;
  const mentors = users.filter(
    (user) => user?.role?.toLowerCase() === "mentor",
  ).length;

  const activityRate =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Calculate real growth rate from user creation dates
  const calculateGrowthRate = () => {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const thisMonthUsers = users.filter((user) => {
      const userDate = user?.createdAt?.toDate
        ? user.createdAt.toDate()
        : new Date(user?.createdAt);
      return userDate >= lastMonth;
    }).length;

    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate(),
    );
    const previousMonthUsers = users.filter((user) => {
      const userDate = user?.createdAt?.toDate
        ? user.createdAt.toDate()
        : new Date(user?.createdAt);
      return userDate >= previousMonth && userDate < lastMonth;
    }).length;

    // More logical growth calculation
    if (previousMonthUsers === 0) {
      return thisMonthUsers > 0 ? 100 : 0; // New growth if no previous users
    }

    const growthPercentage =
      ((thisMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
    return Math.round(growthPercentage);
  };

  const growthRate = calculateGrowthRate();

  // Filter users
  const filteredUsers = users.filter((user) => {
    const name = user?.name || "";
    const email = user?.email || "";
    const role = user?.role || "";
    const status = user?.verificationStatus || "";
    const createdAt = user?.createdAt || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      user.verificationStatus?.toLowerCase() === statusFilter.toLowerCase() ||
      // Include users with profileUnderReview when statusFilter is "all"
      (statusFilter === "all" && user?.profileUnderReview) ||
      // Handle profile-review filter
      (statusFilter === "profile-review" && user?.profileUnderReview);

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        if (!createdAt) return false;
        const userDate = new Date(createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return diffDays === 0;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Chart data
  const roleData = [
    { name: "Freelancers", value: freelancers, color: "#3B82F6" },
    { name: "Companies", value: companies, color: "#8B5CF6" },
    { name: "Mentors", value: mentors, color: "#10B981" },
  ];

  const statusData = [
    { name: "Active", value: activeUsers, color: "#10B981" },
    { name: "Pending", value: pendingUsers, color: "#F59E0B" },
    { name: "Rejected", value: rejectedUsers, color: "#EF4444" },
    { name: "Suspended", value: suspendedUsers, color: "#6B7280" },
    {
      name: "Profile Review",
      value: profileUnderReviewUsers,
      color: "#8B5CF6",
    },
  ];

  // Generate real monthly growth data from user creation dates
  const generateMonthlyGrowthData = () => {
    const months = [];
    const now = new Date();

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthUsers = users.filter((user) => {
        const userDate = user?.createdAt?.toDate
          ? user.createdAt.toDate()
          : new Date(user?.createdAt);
        return userDate >= monthDate && userDate <= monthEnd;
      }).length;

      months.push({
        month: monthDate.toLocaleDateString("en-US", { month: "short" }),
        users: monthUsers,
      });
    }

    return months;
  };

  const monthlyGrowth = generateMonthlyGrowthData();

  // Actions
  const handleApprove = (userId) => {
    setUsers(
      users.map((user) =>
        user?.id === userId
          ? { ...user, verificationStatus: "Approved" }
          : user,
      ),
    );
    // Force refresh session to update immediately
    getSession({ force: true });
  };

  const handleReject = (userId) => {
    setUsers(
      users.map((user) =>
        user?.id === userId
          ? { ...user, verificationStatus: "Rejected" }
          : user,
      ),
    );
    // Force refresh session to update immediately
    getSession({ force: true });
  };

  const handleSuspend = async (userId) => {
    try {
      const user = users.find((u) => u?.id === userId);
      if (!user) {
        toast.error("User not found");
        return;
      }

      // حفظ الحالة الأصلية للعودة إليها عند إلغاء التعليق
      const originalStatus = user.verificationStatus;
      const newStatus =
        user.verificationStatus === "Suspended"
          ? user.originalStatus || "Approved"
          : "Suspended";

      // تحديث الحالة محليًا
      setUsers(
        users.map((u) =>
          u?.id === userId
            ? {
                ...u,
                verificationStatus: newStatus,
                originalStatus:
                  newStatus === "Suspended" ? originalStatus : undefined, // حفظ الحالة الأصلية
              }
            : u,
        ),
      );

      // تحديث الحالة على الخادم
      await updateUser(userId, {
        verificationStatus: newStatus,
        originalStatus: newStatus === "Suspended" ? originalStatus : undefined,
      });

      // إشعار المستخدم بالنجاح
      toast.success(
        newStatus === "Suspended"
          ? "User account suspended successfully"
          : "User account unsuspended successfully",
      );

      // إعادة تحميل الجلسة إذا لزم الأمر
      await getSession({ force: true });
    } catch (error) {
      console.error("Error updating user suspension:", error);
      toast.error("Failed to update user status");
      // إعادة الحالة المحلية إذا فشل التحديث
      setUsers(users); // إعادة تعيين القائمة لتجنب عدم الاتساق
    }
  };
  const handleApproveProfile = (userId) => {
    setUsers(
      users.map((user) =>
        user?.id === userId
          ? {
              ...user,
              profileUnderReview: false,
              profileCompleted: true,
            }
          : user,
      ),
    );
    // Force refresh session to update immediately
    getSession({ force: true });
  };

  const handleRejectProfile = (userId) => {
    setUsers(
      users.map((user) =>
        user?.id === userId
          ? {
              ...user,
              profileUnderReview: false,
              profileCompleted: false,
            }
          : user,
      ),
    );
    // Force refresh session to update immediately
    getSession({ force: true });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUsers = () => {
    // Refresh users data
    getAllUsers().then(setUsers);

    // Also refresh the page to update any cached data
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Rejected
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 transition-colors">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
            Pending
          </Badge>
        );
      case "Suspended":
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            Unknown
          </Badge>
        );
    }
  };

  const getStatusBadgeWithProfileReview = (user) => {
    const baseBadge = getStatusBadge(user?.verificationStatus);

    // If user is approved but profile is under review, show additional badge
    if (user?.verificationStatus === "Approved" && user?.profileUnderReview) {
      return (
        <div className="flex flex-col gap-1">
          {baseBadge}
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            Profile Review
          </Badge>
        </div>
      );
    }

    return baseBadge;
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "freelancer":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Freelancer
          </Badge>
        );
      case "company":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Company
          </Badge>
        );
      case "mentor":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Mentor
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              {/* <p className="text-lg text-muted-foreground">Loading Users...</p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-6 p-4 pt-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Users Management
            </h2>
            <p className="text-muted-foreground">
              Manage and analyze platform users
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p
                className={`text-xs ${growthRate >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {growthRate >= 0 ? "+" : ""}
                {growthRate}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {activityRate}% activity rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp
                className={`h-4 w-4 ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${growthRate >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {growthRate >= 0 ? "+" : ""}
                {growthRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {growthRate >= 0 ? "Monthly growth" : "Monthly decline"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {roleData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Search, filter, and manage platform users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="profile-review">
                      Profile Review
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={itemsPerPage}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={5}>5</SelectItem>
                    <SelectItem value={10}>10</SelectItem>
                    <SelectItem value={20}>20</SelectItem>
                    <SelectItem value={50}>50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={
                      viewMode === "table"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    Table
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    Grid
                  </Button>
                </div>
              </div>

              {/* Table View */}
              {viewMode === "table" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <motion.tr
                          key={user?.id || Math.random()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                {user?.avatar ? (
                                  <Image
                                    src={user.avatar}
                                    alt={user?.name || "Avatar"}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-200">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </div>
                                )}
                                <div
                                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    user?.verificationStatus === "Approved"
                                      ? "bg-green-500"
                                      : user?.verificationStatus === "Pending"
                                        ? "bg-yellow-500"
                                        : user?.verificationStatus ===
                                            "Rejected"
                                          ? "bg-red-500"
                                          : user?.verificationStatus ===
                                              "Suspended"
                                            ? "bg-gray-500"
                                            : "bg-gray-400"
                                  }`}
                                ></div>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                  {user?.name || "-"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user?.email || "-"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user?.role)}</TableCell>
                          <TableCell>
                            <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
                              {user?.nationalId || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadgeWithProfileReview(user)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {formatDate(user?.createdAt)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user?.createdAt
                                  ? Math.floor(
                                      (new Date() - new Date(user.createdAt)) /
                                        (1000 * 60 * 60 * 24),
                                    ) + " days ago"
                                  : "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {(user?.verificationStatus === "Pending" ||
                                  (user?.verificationStatus === "Approved" &&
                                    !user?.profileCompleted) ||
                                  (user?.verificationStatus === "Approved" &&
                                    user?.profileUnderReview)) && (
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetails(user)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                )}
                                {user?.verificationStatus === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApprove(user?.id)}
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleReject(user?.id)}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {user?.verificationStatus === "Approved" &&
                                  user?.profileUnderReview && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleApproveProfile(user?.id)
                                        }
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleRejectProfile(user?.id)
                                        }
                                      >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject Profile
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                <DropdownMenuItem
                                  onClick={() => handleSuspend(user?.id)}
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentUsers.map((user) => (
                    <motion.div
                      key={user?.id || Math.random()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            {user?.avatar && (
                              <Image
                                src={user.avatar}
                                alt={user?.name || "Avatar"}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold">
                                {user?.name || "-"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {user?.email || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {getRoleBadge(user?.role)}
                            {getStatusBadgeWithProfileReview(user)}
                            <p className="text-xs text-muted-foreground">
                              Joined: {formatDate(user?.createdAt)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria.
                </div>
              )}

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdate={handleUpdateUsers}
      />
    </div>
  );
}

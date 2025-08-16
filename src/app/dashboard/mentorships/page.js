"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Check,
  X,
  Eye,
  ExternalLink,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
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
import { toast } from "sonner";
import {
  getAllMentorshipSessions,
  getMentorshipSessionsSnapshot,
  getAllMentorshipRequests,
  getMentorshipRequestsSnapshot,
  getMentorshipStatistics,
  updateSessionStatus,
  completeSession,
  cancelSession,
  approveRequest,
  rejectRequest,
  searchMentorshipSessions,
  searchMentorshipRequests,
} from "@/services/mentorshipService";
import { adminCancelSession } from "@/services/sessionServices";
import { UsersContext } from "@/context/usersContext";

export default function MentorshipsPage() {
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("all");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalRequests: 0,
    completedSessions: 0,
    pendingSessions: 0,
    confirmedSessions: 0,
    cancelledSessions: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  const { users } = useContext(UsersContext);

  // Confirmation dialog state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);

  // Helper function to get user name by ID
  const getUserName = (userId) => {
    if (!userId || !users) return "Unknown User";
    const user = users.find((u) => u.id === userId);
    return user ? user.name || user.email || "Unknown User" : "Unknown User";
  };

  // Helper function to get user profile link
  const getUserProfileLink = (userId) => {
    if (!userId || !users) return "#";
    const user = users.find((u) => u.id === userId);
    if (!user) return "#";

    // Check if user is a mentor (using multiple possible field names)
    if (
      user.isMentor ||
      user.role === "mentor" ||
      user.userType === "mentor" ||
      user.mentorProfile
    ) {
      return `/mentor/${user.id}`;
    }

    // Check if user is a freelancer (using multiple possible field names)
    if (
      user.isFreelancer ||
      user.role === "freelancer" ||
      user.userType === "freelancer" ||
      user.freelancerProfile
    ) {
      return `/profile/${user.id}`;
    }

    // Try to determine from other fields
    if (user.mentorId || user.mentorProfile || user.specializations) {
      return `/mentor/${user.id}`;
    }

    if (user.freelancerId || user.freelancerProfile || user.skills) {
      return `/profile/${user.id}`;
    }

    // Default fallback - use freelancer profile as it's more common
    return `/profile/${user.id}`;
  };

  // Helper function to check if date is within week range
  const isWithinWeek = (dateString) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)
      endOfWeek.setHours(23, 59, 59, 999);

      return date >= startOfWeek && date <= endOfWeek;
    } catch (error) {
      return false;
    }
  };

  // Filter data
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(session.mentorId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getUserName(session.bookedBy)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      sessionStatusFilter === "all" || session.status === sessionStatusFilter;

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        if (!session.date) return false;
        const sessionDate = new Date(session.date);
        const now = new Date();
        const diffDays = Math.floor(
          (now - sessionDate) / (1000 * 60 * 60 * 24),
        );

        switch (dateFilter) {
          case "today":
            return diffDays === 0;
          case "week":
            return isWithinWeek(session.date);
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      getUserName(request.menteeId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.menteeTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      requestStatusFilter === "all" || request.status === requestStatusFilter;

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        if (!request.createdAt) return false;
        const requestDate = new Date(request.createdAt);
        const now = new Date();
        const diffDays = Math.floor(
          (now - requestDate) / (1000 * 60 * 60 * 24),
        );

        switch (dateFilter) {
          case "today":
            return diffDays === 0;
          case "week":
            return isWithinWeek(request.createdAt);
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  // Chart data with proper data validation
  const sessionStatusData = [
    {
      name: "Pending",
      value: Math.max(0, stats.pendingSessions),
      color: "#F59E0B",
    },
    {
      name: "Confirmed",
      value: Math.max(0, stats.confirmedSessions),
      color: "#3B82F6",
    },
    {
      name: "Completed",
      value: Math.max(0, stats.completedSessions),
      color: "#10B981",
    },
    {
      name: "Cancelled",
      value: Math.max(0, stats.cancelledSessions),
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0); // Only show non-zero values

  console.log("Stats for chart:", stats);
  console.log("Session status data:", sessionStatusData);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sessionsData, requestsData, statsData] = await Promise.all([
          getAllMentorshipSessions(),
          getAllMentorshipRequests(),
          getMentorshipStatistics(),
        ]);

        console.log("Sessions loaded:", sessionsData);
        console.log("Stats loaded:", statsData);

        setSessions(sessionsData);
        setRequests(requestsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading mentorship data:", error);
        toast.error("Failed to load mentorship data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    let unsubscribeSessions = null;
    let unsubscribeRequests = null;

    const setupListeners = async () => {
      try {
        // Set up sessions listener
        unsubscribeSessions = await getMentorshipSessionsSnapshot(
          (sessions) => {
            setSessions(sessions);
          },
        );

        // Set up requests listener
        unsubscribeRequests = await getMentorshipRequestsSnapshot(
          (requests) => {
            setRequests(requests);
          },
        );
      } catch (error) {
        console.error("Error setting up listeners:", error);
      }
    };

    setupListeners();

    return () => {
      if (unsubscribeSessions && typeof unsubscribeSessions === "function") {
        unsubscribeSessions();
      }
      if (unsubscribeRequests && typeof unsubscribeRequests === "function") {
        unsubscribeRequests();
      }
    };
  }, []);

  // Actions
  const handleCompleteSession = async (sessionId) => {
    try {
      await completeSession(sessionId, "admin");
      toast.success("Session marked as completed");
    } catch (error) {
      console.error("Error completing session:", error);
      toast.error("Failed to complete session");
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      await cancelSession(sessionId, "Cancelled by admin");
      toast.success("Session cancelled");
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast.error("Failed to cancel session");
    }
  };

  // Admin cancel session function
  const handleAdminCancelSession = async (sessionId) => {
    try {
      // Get session data first
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        toast.error("Session not found");
        return;
      }

      // Set session to cancel and show confirmation dialog
      setSessionToCancel(session);
      setShowCancelConfirm(true);
    } catch (error) {
      console.error("Error preparing to cancel session:", error);
      toast.error("Failed to prepare session cancellation");
    }
  };

  // Confirm cancellation function
  const confirmCancelSession = async () => {
    if (!sessionToCancel) return;

    try {
      // Use the admin cancel session service
      await adminCancelSession(
        sessionToCancel.id,
        sessionToCancel.freelancerId || sessionToCancel.bookedBy,
      );

      toast.success("Session cancelled by admin successfully!");

      // Refresh data
      await handleRefreshData();
    } catch (error) {
      console.error("Error cancelling session by admin:", error);
      toast.error("Failed to cancel session. Please try again.");
    } finally {
      // Close dialog and reset state
      setShowCancelConfirm(false);
      setSessionToCancel(null);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await approveRequest(requestId, "admin");
      toast.success("Request approved");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectRequest(requestId, "admin", "Rejected by admin");
      toast.success("Request rejected");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const [sessionsData, requestsData, statsData] = await Promise.all([
        getAllMentorshipSessions(),
        getAllMentorshipRequests(),
        getMentorshipStatistics(),
      ]);

      setSessions(sessionsData);
      setRequests(requestsData);
      setStats(statsData);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Scheduled
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Mentorships Management
          </h2>
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedSessions} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingRequests} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSessions > 0
                  ? Math.round(
                      (stats.completedSessions / stats.totalSessions) * 100,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Sessions completed successfully
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Session Overview
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalSessions}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-green-600 font-medium">
                  {stats.completedSessions} Completed
                </span>
                <span className="text-blue-600 font-medium">
                  {stats.confirmedSessions} Confirmed
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-yellow-600 font-medium">
                  {stats.pendingSessions} Pending
                </span>
                <span className="text-red-600 font-medium">
                  {stats.cancelledSessions} Cancelled
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sessionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No session data available
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Sessions:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats.totalSessions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Sessions:</span>
                  <span className="text-xl font-semibold text-yellow-600">
                    {stats.pendingSessions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Confirmed Sessions:
                  </span>
                  <span className="text-xl font-semibold text-blue-600">
                    {stats.confirmedSessions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Completed Sessions:
                  </span>
                  <span className="text-xl font-semibold text-green-600">
                    {stats.completedSessions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Cancelled Sessions:
                  </span>
                  <span className="text-xl font-semibold text-red-600">
                    {stats.cancelledSessions}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sessions">Mentorship Sessions</TabsTrigger>
            <TabsTrigger value="requests">Mentorship Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Sessions</CardTitle>
                <CardDescription>
                  Monitor scheduled and completed mentorship sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Select
                    value={sessionStatusFilter}
                    onValueChange={setSessionStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sessions Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Booked By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            {session.title || "Untitled Session"}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={getUserProfileLink(session.mentorId)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {getUserName(session.mentorId)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {session.status === "Pending" ||
                            session.status === "Cancelled" ? (
                              <span className="text-gray-500 italic">
                                Not Booked
                              </span>
                            ) : (
                              <Link
                                href={getUserProfileLink(session.bookedBy)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {getUserName(session.bookedBy)}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(session.date)}</TableCell>
                          <TableCell>{formatTime(session.time)}</TableCell>
                          <TableCell>{session.duration || "N/A"}</TableCell>
                          <TableCell>
                            {getStatusBadge(session.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/session/${session.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>

                                {/* Admin Cancel Session Button - Only show for Confirmed sessions */}
                                {session.status === "Confirmed" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAdminCancelSession(session.id)
                                    }
                                    className="text-red-700 font-medium"
                                  >
                                    🚫 Cancel Session (Admin)
                                  </DropdownMenuItem>
                                )}
                                {session.googleMeetLink && (
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={session.googleMeetLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Join Google Meet
                                    </a>
                                  </DropdownMenuItem>
                                )}
                                {session.zoomLink && (
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={session.zoomLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Join Zoom
                                    </a>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredSessions.length)} of{" "}
                      {filteredSessions.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>
                  Approve or reject mentorship requests from mentees
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Select
                    value={requestStatusFilter}
                    onValueChange={setRequestStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Requests Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentee Name</TableHead>
                        <TableHead>Mentee Title</TableHead>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Session ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={getUserProfileLink(request.menteeId)}
                              className="text-blue-600 hover:underline"
                            >
                              {getUserName(request.menteeId)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.menteeTitle || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={getUserProfileLink(request.mentorId)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {getUserName(request.mentorId)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.sessionId}</Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {request.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApproveRequest(request.id)
                                      }
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRejectRequest(request.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      {showCancelConfirm && sessionToCancel && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Cancellation</h3>
            <p className="text-sm text-gray-800 mb-4">
              Are you sure you want to cancel this session? This action cannot
              be undone and will notify both the mentor and freelancer.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmCancelSession}>
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

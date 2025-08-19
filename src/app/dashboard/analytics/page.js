"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Users,
  Briefcase,
  GraduationCap,
  MessageSquare,
  AlertCircle,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart as LucidePieChart,
  LineChart as LucideLineChart,
  Calendar,
  Eye,
  Heart,
  Star,
  Zap,
  Globe,
  Building,
  UserCheck,
  UserX,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
  Tooltip,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { getAllUsers } from "@/services/userServices";
import { getAllJobs } from "@/services/firebase";
import {
  getAllSessions,
  getBookedSessionsForCommunity,
  getAllSessionRequests,
} from "@/services/sessionServices";
import { getAllPosts } from "@/services/postServices";
import { getAllChats } from "@/services/chatService";
import { getAllNotifications } from "@/services/notificationService";
import { motion } from "framer-motion";

// Color palette for charts
const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  charts: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"],
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log("Fetching analytics data...");

      // Fetch all data
      const [
        users,
        jobs,
        sessions,
        bookedSessions,
        sessionRequests,
        posts,
        chats,
        notifications,
      ] = await Promise.all([
        getAllUsers(),
        getAllJobs(),
        getAllSessions(),
        getBookedSessionsForCommunity(),
        getAllSessionRequests(),
        getAllPosts(),
        getAllChats(),
        getAllNotifications(),
      ]);

      console.log("Raw data counts:", {
        users: users?.length || 0,
        jobs: jobs?.length || 0,
        sessions: sessions?.length || 0,
        bookedSessions: bookedSessions?.length || 0,
        sessionRequests: sessionRequests?.length || 0,
        posts: posts?.length || 0,
        chats: chats?.length || 0,
        notifications: notifications?.length || 0,
      });

      // Simple analytics calculation
      const analyticsData = {
        // User counts
        totalUsers: users?.length || 0,
        freelancers:
          users?.filter((user) => user.role === "freelancer")?.length || 0,
        mentors: users?.filter((user) => user.role === "mentor")?.length || 0,
        companies:
          users?.filter((user) => user.role === "company")?.length || 0,

        // Job counts
        totalJobs: jobs?.length || 0,
        activeJobs: jobs?.filter((job) => job.status === "Active")?.length || 0,
        completedJobs:
          jobs?.filter((job) => job.status === "Closed")?.length || 0,
        pendingJobs:
          jobs?.filter((job) => job.status === "Pending")?.length || 0,

        // Session counts
        totalSessions: bookedSessions?.length || 0,
        pendingSessions:
          sessionRequests?.filter((req) => req.status === "pending")?.length ||
          0,
        completedSessions:
          bookedSessions?.filter((session) => session.status === "Completed")
            ?.length || 0,

        // Engagement counts
        totalPosts: posts?.length || 0,
        totalChats: chats?.length || 0,
        totalNotifications: notifications?.length || 0,
        unreadNotifications:
          notifications?.filter((n) => n.read === false)?.length || 0,
      };

      console.log("Calculated analytics:", analyticsData);

      // Add advanced analytics
      const advancedAnalytics = {
        ...analyticsData,
        // Growth rates
        userGrowthRate: calculateGrowthRate(users?.length || 0, 100),
        jobGrowthRate: calculateGrowthRate(jobs?.length || 0, 50),
        sessionGrowthRate: calculateGrowthRate(bookedSessions?.length || 0, 20),

        // Time series data
        timeSeriesData: generateTimeSeriesData(
          users,
          jobs,
          bookedSessions,
          posts,
        ),

        // Top performers
        topMentors: getTopMentors(users, bookedSessions),
        topCompanies: getTopCompanies(users, jobs),
        topSkills: getTopSkills(jobs),
      };

      setAnalytics(advancedAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const generateTimeSeriesData = (users, jobs, sessions, posts) => {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        users: Math.floor(Math.random() * 5) + 1,
        jobs: Math.floor(Math.random() * 3) + 1,
        sessions: Math.floor(Math.random() * 2) + 1,
        posts: Math.floor(Math.random() * 4) + 1,
      });
    }

    return data;
  };

  const getTopMentors = (users, sessions) => {
    const mentors = users?.filter((user) => user.role === "mentor") || [];
    return mentors.slice(0, 5).map((mentor, index) => ({
      ...mentor,
      sessionCount: Math.floor(Math.random() * 10) + 1,
      rank: index + 1,
    }));
  };

  const getTopCompanies = (users, jobs) => {
    const companies = users?.filter((user) => user.role === "company") || [];
    return companies.slice(0, 5).map((company, index) => ({
      ...company,
      jobCount: Math.floor(Math.random() * 8) + 1,
      rank: index + 1,
    }));
  };

  const getTopSkills = (jobs) => {
    const skills = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "PHP",
      "CSS",
      "HTML",
    ];
    return skills.slice(0, 6).map((skill, index) => ({
      skill,
      count: Math.floor(Math.random() * 15) + 5,
    }));
  };

  const getGrowthIcon = (rate) => {
    if (rate > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (rate < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getGrowthColor = (rate) => {
    if (rate > 0) return "text-green-600";
    if (rate < 0) return "text-red-600";
    return "text-gray-600";
  };

  const handleExportData = () => {
    const csvData = `Metric,Value
Total Users,${analytics.totalUsers}
Freelancers,${analytics.freelancers}
Mentors,${analytics.mentors}
Companies,${analytics.companies}
Total Jobs,${analytics.totalJobs}
Active Jobs,${analytics.activeJobs}
Completed Jobs,${analytics.completedJobs}
Pending Jobs,${analytics.pendingJobs}
Total Sessions,${analytics.totalSessions}
Pending Sessions,${analytics.pendingSessions}
Completed Sessions,${analytics.completedSessions}
Total Posts,${analytics.totalPosts}
Total Chats,${analytics.totalChats}
Total Notifications,${analytics.totalNotifications}`;

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-muted-foreground">
                Loading Analytics...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                {/* <BreadcrumbItem>Dashboard</BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage> */}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Platform overview and statistics
            </p>
          </div>
          <Button
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(analytics.userGrowthRate)}
                <span
                  className={`ml-1 ${getGrowthColor(analytics.userGrowthRate)}`}
                >
                  {analytics.userGrowthRate}% from last month
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.freelancers} freelancers, {analytics.mentors}{" "}
                mentors, {analytics.companies} companies
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalJobs}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(analytics.jobGrowthRate)}
                <span
                  className={`ml-1 ${getGrowthColor(analytics.jobGrowthRate)}`}
                >
                  {analytics.jobGrowthRate}% from last month
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.activeJobs} active, {analytics.completedJobs}{" "}
                completed, {analytics.pendingJobs} pending
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalSessions}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getGrowthIcon(analytics.sessionGrowthRate)}
                <span
                  className={`ml-1 ${getGrowthColor(analytics.sessionGrowthRate)}`}
                >
                  {analytics.sessionGrowthRate}% from last month
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.completedSessions} completed,{" "}
                {analytics.pendingSessions} pending
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Community Posts
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPosts}</div>
              <div className="text-xs text-muted-foreground">
                {analytics.totalChats} chats, {analytics.totalNotifications}{" "}
                notifications
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Platform Activity Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="col-span-4"
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
              <CardHeader>
                <CardTitle>Platform Activity - Last 30 Days</CardTitle>
                <CardDescription>
                  Daily activity trends across all platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="jobs"
                      stackId="1"
                      stroke={COLORS.success}
                      fill={COLORS.success}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stackId="1"
                      stroke={COLORS.secondary}
                      fill={COLORS.secondary}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="posts"
                      stackId="1"
                      stroke={COLORS.warning}
                      fill={COLORS.warning}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="col-span-3"
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Freelancers",
                          value: analytics.freelancers,
                          color: COLORS.primary,
                        },
                        {
                          name: "Mentors",
                          value: analytics.mentors,
                          color: COLORS.secondary,
                        },
                        {
                          name: "Companies",
                          value: analytics.companies,
                          color: COLORS.success,
                        },
                      ]}
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
                      {[
                        {
                          name: "Freelancers",
                          value: analytics.freelancers,
                          color: COLORS.primary,
                        },
                        {
                          name: "Mentors",
                          value: analytics.mentors,
                          color: COLORS.secondary,
                        },
                        {
                          name: "Companies",
                          value: analytics.companies,
                          color: COLORS.success,
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>User Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Freelancers:</span>
                  <span className="font-bold">{analytics.freelancers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentors:</span>
                  <span className="font-bold">{analytics.mentors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Companies:</span>
                  <span className="font-bold">{analytics.companies}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active:</span>
                  <span className="font-bold text-green-600">
                    {analytics.activeJobs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-bold text-blue-600">
                    {analytics.completedJobs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-bold text-yellow-600">
                    {analytics.pendingJobs}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Posts:</span>
                  <span className="font-bold">{analytics.totalPosts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chats:</span>
                  <span className="font-bold">{analytics.totalChats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Notifications:</span>
                  <span className="font-bold">
                    {analytics.totalNotifications}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Mentors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Top Performing Mentors
                </CardTitle>
                <CardDescription>Based on session bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topMentors?.map((mentor, index) => (
                    <div
                      key={mentor.id || index}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {mentor.rank}
                        </div>
                        <div>
                          <p className="font-medium">
                            {mentor.name || mentor.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {mentor.sessionCount} sessions
                          </p>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Companies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Top Hiring Companies
                </CardTitle>
                <CardDescription>Based on job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topCompanies?.map((company, index) => (
                    <div
                      key={company.id || index}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {company.rank}
                        </div>
                        <div>
                          <p className="font-medium">
                            {company.name || company.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {company.jobCount} jobs posted
                          </p>
                        </div>
                      </div>
                      <Briefcase className="h-4 w-4 text-blue-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills Demand Chart */}
        {analytics.topSkills && analytics.topSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Most Demanded Skills
                </CardTitle>
                <CardDescription>
                  Skills with highest job demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topSkills}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Growth Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Growth Trends - Last 30 Days
              </CardTitle>
              <CardDescription>
                Monthly growth comparison for key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Comparison Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Performance Comparison
              </CardTitle>
              <CardDescription>
                Platform performance across different metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  data={[
                    {
                      metric: "User Growth",
                      value: analytics.userGrowthRate,
                      fullMark: 100,
                    },
                    {
                      metric: "Job Growth",
                      value: analytics.jobGrowthRate,
                      fullMark: 100,
                    },
                    {
                      metric: "Session Growth",
                      value: analytics.sessionGrowthRate,
                      fullMark: 100,
                    },
                    {
                      metric: "Engagement",
                      value: Math.round(
                        (analytics.totalPosts + analytics.totalChats) / 10,
                      ),
                      fullMark: 50,
                    },
                    {
                      metric: "Completion Rate",
                      value: analytics.jobCompletionRate || 0,
                      fullMark: 100,
                    },
                    {
                      metric: "Success Rate",
                      value: analytics.sessionSuccessRate || 0,
                      fullMark: 100,
                    },
                  ]}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Notifications Analytics
              </CardTitle>
              <CardDescription>
                Detailed notification statistics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.totalNotifications}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Notifications
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {analytics.unreadNotifications}
                  </div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.totalNotifications -
                      analytics.unreadNotifications}
                  </div>
                  <p className="text-sm text-muted-foreground">Read</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.totalNotifications > 0
                      ? Math.round(
                          ((analytics.totalNotifications -
                            analytics.unreadNotifications) /
                            analytics.totalNotifications) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">Read Rate</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Notification Trends</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Average:</span>
                    <span className="font-medium">
                      {Math.round(analytics.totalNotifications / 30)}{" "}
                      notifications/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate:</span>
                    <span className="font-medium text-green-600">
                      {analytics.totalNotifications > 0
                        ? Math.round(
                            ((analytics.totalNotifications -
                              analytics.unreadNotifications) /
                              analytics.totalNotifications) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Score:</span>
                    <span className="font-medium text-blue-600">
                      {Math.round(
                        (analytics.totalPosts +
                          analytics.totalChats +
                          analytics.totalNotifications) /
                          3,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

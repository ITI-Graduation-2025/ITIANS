"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { getAllUsers } from "@/services/userServices";
import { getArrayFromValue } from "@/utils/arrayUtils";
import { useEffect, useState } from "react";
import {
  getAllSessionRequests,
  getBookedSessionsForCommunity,
} from "@/services/sessionServices";
import { getAllPosts } from "@/services/postServices";
import { getAllChats } from "@/services/chatService";
import { getAllJobs } from "@/services/firebase";
import { getAllNotifications } from "@/services/notificationService";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
  ),
});

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          usersData,
          bookedSessionsData,
          sessionRequestsData,
          postsData,
          chatsData,
          jobsData,
          notificationsData,
        ] = await Promise.all([
          getAllUsers(),
          getBookedSessionsForCommunity(),
          getAllSessionRequests(),
          getAllPosts(),
          getAllChats(),
          getAllJobs(),
          getAllNotifications(),
        ]);

        setUsers(usersData);
        setBookedSessions(bookedSessionsData);
        setSessionRequests(sessionRequestsData);
        setPosts(postsData);
        setChats(chatsData);
        setJobs(jobsData);
        setNotifications(notificationsData);

        // Filter users by role
        const freelancersData = getArrayFromValue(
          usersData,
          "role",
          "freelancer",
        );
        const mentorsData = getArrayFromValue(usersData, "role", "mentor");
        const companiesData = getArrayFromValue(usersData, "role", "company");

        setFreelancers(freelancersData);
        setMentors(mentorsData);
        setCompanies(companiesData);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data for statistics
  const activeJobs = jobs.filter((job) => job.status === "Active").length;
  const completedJobs = jobs.filter((job) => job.status === "Closed").length;
  const pendingSessionRequests = sessionRequests.filter(
    (request) => request.status === "pending",
  ).length;
  const unreadNotifications = notifications.filter(
    (notification) => notification.read === false,
  ).length;

  // Calculate more exciting statistics
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const totalSessions = bookedSessions.length;
  const totalJobs = jobs.length;

  // User engagement metrics
  const userEngagementRate =
    totalUsers > 0 ? Math.round((totalSessions / totalUsers) * 100) : 0;
  const jobCompletionRate =
    totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const sessionSuccessRate =
    totalSessions > 0 ? Math.round((1 / totalSessions) * 100) : 0; // wait to add completed session by mentor

  // Platform activity metrics
  const activeChats = chats.length;
  const totalNotifications = notifications.length;
  const readNotifications = notifications.filter((n) => n.read === true).length;
  const notificationReadRate =
    totalNotifications > 0
      ? Math.round((readNotifications / totalNotifications) * 100)
      : 0;

  // Get recent notifications (latest 5)
  const recentNotifications = notifications
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, 5);

  // Generate time-based data for the last 7 days
  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Filter data for this specific date
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayNotifications = notifications.filter((n) => {
        const notifDate = n.createdAt?.toDate
          ? n.createdAt.toDate()
          : new Date(n.createdAt);
        return notifDate >= dayStart && notifDate <= dayEnd;
      }).length;

      const daySessions = bookedSessions.filter((s) => {
        const sessionDate = s.updatedAt?.toDate
          ? s.updatedAt.toDate()
          : new Date(s.updatedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      }).length;

      const dayPosts = posts.filter((p) => {
        const postDate = p.createdAt?.toDate
          ? p.createdAt.toDate()
          : new Date(p.createdAt);
        return postDate >= dayStart && postDate <= dayEnd;
      }).length;

      const dayJobs = jobs.filter((j) => {
        const jobDate = j.createdAt?.toDate
          ? j.createdAt.toDate()
          : new Date(j.createdAt);
        return jobDate >= dayStart && jobDate <= dayEnd;
      }).length;

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        notifications: dayNotifications,
        sessions: daySessions,
        posts: dayPosts,
        jobs: dayJobs,
      });
    }

    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  const chartConfig = {
    notifications: {
      label: "Notifications",
      color: "#EF4444",
    },
    sessions: {
      label: "Booked Sessions",
      color: "#3B82F6",
    },
    posts: {
      label: "Posts",
      color: "#10B981",
    },
    jobs: {
      label: "Jobs",
      color: "#F59E0B",
    },
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-muted-foreground"></p>
            </div>
          </div>

          {/* Achievement Highlights */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {jobCompletionRate}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Jobs completed successfully
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Community Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {chats.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Active conversations
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {pendingSessionRequests}
                </div>
                <p className="text-sm text-muted-foreground">
                  Session requests waiting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Dashboard
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Button asChild>
              <Link href="/dashboard/analytics">View Detailed Analytics</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Freelancers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freelancers.length}</div>
              <p className="text-xs text-muted-foreground">
                Active freelancers on platform
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered companies
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mentors
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.length}</div>
              <p className="text-xs text-muted-foreground">Available mentors</p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">
                Currently open positions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {/* Recent Activity */}
          <Card className="col-span-3 shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.createdAt?.toDate
                            ? notification.createdAt.toDate().toLocaleString()
                            : new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Activity Timeline */}
          <Card className="col-span-5 shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>Platform Activity Timeline</CardTitle>
              <CardDescription>
                Daily activity trends over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              >
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, "dataMax + 1"]}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                      className="w-3"
                    />
                    <Line
                      type="monotone"
                      dataKey="notifications"
                      stroke="var(--color-notifications)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-notifications)",
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="var(--color-sessions)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-sessions)",
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="var(--color-posts)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-posts)", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="var(--color-jobs)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-jobs)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="text-lg">User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {userEngagementRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Sessions per user ratio
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="text-lg">Job Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {jobCompletionRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Completed vs total jobs
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="text-lg">Session Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {sessionSuccessRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Sessions leading to jobs
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle className="text-lg">Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalPosts}
              </div>
              <p className="text-sm text-muted-foreground">
                Total community posts
              </p>
            </CardContent>
          </Card>

          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  🔥 Amazing Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {Math.round((totalSessions / Math.max(totalUsers, 1)) * 100)}%
                </div>
                <p className="text-sm text-indigo-100">
                  Avg. sessions per user
                </p>
                <div className="mt-2 text-xs text-indigo-200">
                  {totalUsers} users • {totalSessions} sessions
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Achievement Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobCompletionRate}%
            </div>
            <p className="text-sm text-muted-foreground">
              Jobs completed successfully
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Community Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {chats.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Active conversations
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingSessionRequests}
            </div>
            <p className="text-sm text-muted-foreground">
              Session requests waiting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

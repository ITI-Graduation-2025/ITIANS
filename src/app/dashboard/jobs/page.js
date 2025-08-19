"use client";

import { useState, useEffect } from "react";
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
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  getAllJobs,
  subscribeToJobs,
  deleteJob,
  updateJob,
} from "@/services/firebase";
import { getUniqueValues } from "@/utils/arrayUtils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [updatingJob, setUpdatingJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshJobs = async () => {
    try {
      setRefreshing(true);
      const jobsData = await getAllJobs();
      setJobs(jobsData);
      toast.success("Jobs refreshed successfully");
    } catch (error) {
      console.error("Error refreshing jobs:", error);
      toast.error("Failed to refresh jobs");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await getAllJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToJobs((jobsData) => {
      setJobs(jobsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills &&
        typeof job.skills === "string" &&
        job.skills.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesCompany =
      companyFilter === "all" || job.company === companyFilter;
    const matchesLevel = levelFilter === "all" || job.level === levelFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCompany &&
      matchesLevel &&
      matchesType
    );
  });

  const handleDeleteJob = async (jobId) => {
    if (
      !confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setUpdatingJob(jobId);
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setUpdatingJob(null);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setUpdatingJob(jobId);
      await updateJob(jobId, { status: newStatus });
      toast.success("Job status updated successfully");
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setUpdatingJob(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case "Paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  // const formatDate = (date) => {
  //   if (!date) return "N/A";

  //   if (typeof date === "string") {
  //     return new Date(date).toLocaleDateString();
  //   } else if (date instanceof Date) {
  //     return date.toLocaleDateString();
  //   }

  //   return "N/A";
  // };

  const formatDate = (date) => {
  if (!date) return "N/A";

  let dateObj;

  if (typeof date === "string") {
    // Attempt to parse string dates
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else if (date && typeof date === "object" && date.seconds) {
    // Handle Firestore Timestamp
    dateObj = new Date(date.seconds * 1000 + (date.nanoseconds / 1000000));
  } else if (date && date.toDate && typeof date.toDate === "function") {
    // Handle Firestore Timestamp with toDate method
    dateObj = date.toDate();
  } else {
    return "N/A";
  }

  return dateObj instanceof Date && !isNaN(dateObj)
    ? dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
};

  const uniqueCompanies = getUniqueValues(jobs, "company");

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-muted-foreground">Loading jobs...</p>
            </div>
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
            Jobs Management
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex gap-2"
          >
            <Button
              onClick={refreshJobs}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Jobs"}
            </Button>
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Job
            </Button> */}
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
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">All job postings</p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter((job) => job.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active positions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paused Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {jobs.filter((job) => job.status === "Paused").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Temporarily paused positions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {uniqueCompanies.length}
              </div>
              <p className="text-xs text-muted-foreground">Posting companies</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {jobs.reduce(
                  (total, job) =>
                    total +
                    (Array.isArray(job.applicants) ? job.applicants.length : 0),
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">Across all jobs</p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {jobs.length > 0
                  ? Math.round(
                      jobs.reduce(
                        (total, job) =>
                          total +
                          (Array.isArray(job.applicants)
                            ? job.applicants.length
                            : 0),
                        0,
                      ) / jobs.length,
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Per job posting</p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {jobs.length > 0
                  ? Math.round(
                      (jobs.filter((job) => job.status === "Closed").length /
                        jobs.length) *
                        100,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Jobs completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {jobs.filter((job) => job.status === "Closed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed positions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Details Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                $
                {jobs.length > 0
                  ? Math.round(
                      jobs.reduce(
                        (total, job) => total + (parseInt(job.salary) || 0),
                        0,
                      ) / jobs.length,
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Average salary</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Categories Chart */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        >
          <Card className="shadow-dashboard-card dark:shadow-dashboard-card-dark">
            <CardHeader>
              <CardTitle>Job Categories Overview</CardTitle>
              <CardDescription>
                Distribution of jobs by location, level, and type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Remote Jobs</span>
                    <span className="text-sm text-muted-foreground">
                      {jobs.filter((job) => job.location === "Remote").length}{" "}
                      of {jobs.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${jobs.length > 0 ? (jobs.filter((job) => job.location === "Remote").length / jobs.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Entry Level</span>
                    <span className="text-sm text-muted-foreground">
                      {
                        jobs.filter(
                          (job) => job.level === "Entry Level (0-2 years)",
                        ).length
                      }{" "}
                      of {jobs.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${jobs.length > 0 ? (jobs.filter((job) => job.level === "Entry Level (0-2 years)").length / jobs.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Freelance</span>
                    <span className="text-sm text-muted-foreground">
                      {jobs.filter((job) => job.type === "Freelance").length} of{" "}
                      {jobs.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${jobs.length > 0 ? (jobs.filter((job) => job.type === "Freelance").length / jobs.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Job Postings</CardTitle>
              <CardDescription>
                Monitor and manage job postings across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {uniqueCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Entry Level (0-2 years)">
                      Entry Level
                    </SelectItem>
                    <SelectItem value="Mid Level (3-5 years)">
                      Mid Level
                    </SelectItem>
                    <SelectItem value="Senior Level (5+ years)">
                      Senior Level
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Jobs Table */}
              <div className="rounded-md border relative">
                {updatingJob && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-muted-foreground">
                        Updating...
                      </span>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Skills Required</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          {job.title || "Untitled Job"}
                        </TableCell>
                        <TableCell>
                          {job.company || "Unknown Company"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {job.level || "Not specified"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {job.type || "Not specified"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {job.location || "Not specified"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            ${job.salary || "0"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {job.skills &&
                            typeof job.skills === "string" &&
                            job.skills.length > 0 ? (
                              job.skills.split(",").map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill.trim()}
                                </Badge>
                              ))
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs text-muted-foreground"
                              >
                                No skills listed
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={job.status || "Unknown"}
                            onValueChange={(value) =>
                              handleStatusChange(job.id, value)
                            }
                            disabled={updatingJob === job.id}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue>
                                {updatingJob === job.id
                                  ? "Updating..."
                                  : job.status || "Unknown"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Paused">Paused</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {Array.isArray(job.applicants)
                              ? job.applicants.length
                              : 0}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(job.createdAt)}</TableCell>
                        <TableCell>{formatDate(job.deadline)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                <Link href={`/jobs/${job.id}`}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteJob(job.id)}
                                disabled={updatingJob === job.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {updatingJob === job.id
                                  ? "Deleting..."
                                  : "Delete Job"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {jobs.length === 0 ? (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        No jobs found in the system.
                      </p>
                      <p className="text-sm">
                        Start by adding your first job posting.
                      </p>
                      <Button className="mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Job
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        No jobs found matching your criteria.
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filters.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setCompanyFilter("all");
                          setLevelFilter("all");
                          setTypeFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

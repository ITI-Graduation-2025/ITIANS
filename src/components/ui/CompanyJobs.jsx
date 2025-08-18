"use client";

import { useEffect, useState } from "react";
import CompanyNavbar from "./CompanyNavbar";
import {
  PlayCircle,
  PauseCircle,
  XCircle,
  Briefcase,
  Users2,
  Edit,
  Trash2,
  Eye,
  Plus,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";
import JobForm from "./JobForm";
import TableSkeletonRow from "./TableSkeletonRow";
import StatCardsSkeleton from "./StatCardsSkeleton";

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const [editJob, setEditJob] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  // filters state 
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");

  const experienceLevels = [
    "Entry Level (0-2 years)",
    "Mid Level (2-5 years)",
    "Senior Level (5+ years)"
  ];

  const jobTypes = [
    "Full Time",
    "Part Time",
    "Freelance",
    "Contract"
  ];

  const itemsPerPage = 6;
  const offset = currentPage * itemsPerPage;
  const currentJobs = filteredJobs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredJobs.length / itemsPerPage);

  useEffect(() => {
  if (!companyId) return;

  const unsubscribe = onSnapshot(collection(db, "jobs"), async (snapshot) => {
    const jobsData = [];

    for (const docSnap of snapshot.docs) {
      const job = { id: docSnap.id, ...docSnap.data() };

      // ✅ check deadline
      if (job.deadline) {
        const jobDeadline = job.deadline.seconds
          ? new Date(job.deadline.seconds * 1000)
          : new Date(job.deadline);

        if (jobDeadline < new Date() && job.status !== "Closed") {
          try {
            await updateDoc(doc(db, "jobs", job.id), { status: "Closed" });
            job.status = "Closed"; // update locally too
          } catch (err) {
            console.error("Error updating job status:", err);
          }
        }
      }

      if (job.companyId === companyId) {
        jobsData.push(job);
      }
    }

    const sorted = jobsData.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    setJobs(sorted);
    setFilteredJobs(sorted);
    setLoading(false);
  });

  return () => unsubscribe();
}, [companyId]);


  useEffect(() => {
    let result = jobs;

    // Flexible search
    if (search.trim() !== "") {
      const searchTerm = search.toLowerCase().replace(/[^a-z0-9]/g, "");

      result = result.filter((job) => {
        const deadlineStr = job.deadline
          ? new Date(
              job.deadline.seconds
                ? job.deadline.seconds * 1000
                : job.deadline
            )
              .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          : "";

        return (
          job.title?.toLowerCase().includes(search.toLowerCase()) ||
          job.level?.toLowerCase().includes(search.toLowerCase()) ||
          job.jobType?.toLowerCase().includes(search.toLowerCase()) ||
          deadlineStr.includes(searchTerm)
        );
      });
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((job) => job.status === statusFilter);
    }

    // Experience filter
    if (experienceFilter) {
      result = result.filter(
        (job) =>
          job.level?.trim().toLowerCase() ===
          experienceFilter.trim().toLowerCase()
      );
    }

    // Job type filter
   // Job Type filter
if (jobTypeFilter) {
  result = result.filter(
    (job) =>
      job.type?.trim().toLowerCase() ===
      jobTypeFilter.trim().toLowerCase()
  );
}

// Deadline range filter
if (deadlineFilter) {
  const selectedDate = new Date(deadlineFilter);
  result = result.filter((job) => {
    const jobDeadline = job.deadline
      ? job.deadline.toDate
        ? job.deadline.toDate() 
        : new Date(job.deadline)
      : null;

    return jobDeadline && jobDeadline >= selectedDate;
  });
}

    setFilteredJobs(result);
    setCurrentPage(0);
  }, [search, statusFilter, experienceFilter, jobTypeFilter, deadlineFilter, jobs]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Error deleting job");
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = job.status === "Active" ? "Paused" : "Active";
      await updateDoc(doc(db, "jobs", job.id), { status: newStatus });
      toast.success(
        `Job ${newStatus === "Active" ? "resumed" : "paused"} successfully`
      );
    } catch {
      toast.error("Error updating job status");
    }
  };

  const daysAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const jobDate = date.toDate ? date.toDate() : new Date(date);
    const diff = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
  };
  const stats = [
    {
      label: "All Jobs",
      count: jobs.length,
      icon: <Briefcase className="w-6 h-6 text-[#8B0000]" />,
      color: "bg-white",
      filter: "",
    },
    {
      label: "Active",
      count: jobs.filter((j) => j.status === "Active").length,
      icon: <PlayCircle className="w-6 h-6 text-green-600" />,
      color: "bg-white",
      filter: "Active",
    },
    {
      label: "Paused",
      count: jobs.filter((j) => j.status === "Paused").length,
      icon: <PauseCircle className="w-6 h-6 text-yellow-600" />,
      color: "bg-white",
      filter: "Paused",
    },
    {
      label: "Closed",
      count: jobs.filter((j) => j.status === "Closed").length,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
     color: "bg-white",
      filter: "Closed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Toaster position="bottom-right" />
      <CompanyNavbar />
       
      <main className="p-6 max-w-7xl mx-auto">
  {/* title*/}
  <div className="flex justify-between items-center mb-4">
    <div>
     <h1 className="text-xl md:text-2xl font-bold text-[#003366] tracking-tight flex items-center gap-2">
      Job Posts Management
    </h1>
<p className="text-sm text-gray-500 mt-1">
      Manage, track, and create job opportunities with ease.
    </p>
    </div>
    {/* الزرار يظهر بس لو فيه جوبس */}
    {jobs.length > 0 && (
      <Link href="/PostJob">
        <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b30000] to-[#8B0000] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Post New Job
          </span>
        </button>
      </Link>
    )}
  </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => setStatusFilter(stat.filter)}
              className={`p-4 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col items-center justify-center transition transform hover:-translate-y-1 ${stat.color}`}
            >
              {stat.icon}
              <span className="mt-2 text-lg font-semibold">{stat.count}</span>
              <span className="text-sm text-gray-700">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Search + Filter Bar */}
       <div className="bg-white p-4 rounded-lg shadow mb-4 inline-flex flex-wrap gap-3 items-center ml-20">
  <div className="flex flex-wrap gap-3 items-center">
    <input
      type="text"
      placeholder="Search by  job title..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-2 rounded w-full md:w-1/4"
    />
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border px-3 py-2 rounded w-full md:w-1/6"
    >
      <option value="">All Statuses</option>
      <option value="Active">Active</option>
      <option value="Paused">Paused</option>
      <option value="Closed">Closed</option>
    </select>
    <select
      value={experienceFilter}
      onChange={(e) => setExperienceFilter(e.target.value)}
      className="border px-3 py-2 rounded w-full md:w-1/6"
    >
      <option value="">All Experience Levels</option>
      {experienceLevels.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
    </select>
    <select
      value={jobTypeFilter}
      onChange={(e) => setJobTypeFilter(e.target.value)}
      className="border px-3 py-2 rounded w-full md:w-1/6"
    >
      <option value="">All Job Types</option>
      {jobTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
    <input
      type="date"
      value={deadlineFilter}
      onChange={(e) => setDeadlineFilter(e.target.value)}
      className="border px-3 py-2 rounded w-full md:w-1/6"
    />
  </div>

  {/* Clear Filters */}
  <button
    onClick={() => {
      setSearch("");
      setStatusFilter("");
      setExperienceFilter("");
      setJobTypeFilter("");
      setDeadlineFilter("");
      setCurrentPage(0); 
    }}
    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-900 transition"
  >
    Clear Filters
  </button>
</div>


        {/* Jobs Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Job Title</th>
                <th className="px-4 py-3 text-center">Applications</th>
                <th className="px-4 py-3 text-center">Budget</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Expires</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
           <tbody>
  {loading ? (
    
    Array.from({ length: 5 }).map((_, i) => <TableSkeletonRow key={i} />)
  ) : currentJobs.length > 0 ? (
    
    currentJobs.map((job) => (
      <tr key={job.id} className="border-t hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <div className="font-semibold text-gray-800">{job.title}</div>
          <div className="text-xs text-gray-500">
            {job.experienceLevel} • {daysAgo(job.createdAt)}
          </div>
        </td>

        <td className="px-4 py-3 text-center text-blue-600 font-medium flex justify-center items-center gap-1">
          <Users2 className="w-4 h-4" /> {job.applicationsCount || 0}
        </td>

        <td className="px-4 py-3 text-center">{job.salary || "-"}</td>

        <td className="px-4 py-3 text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === "Active"
                ? "bg-green-100 text-green-700"
                : job.status === "Paused"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.status}
          </span>
        </td>

        <td className="px-4 py-3 text-center">
          {job.deadline ? daysLeft(job.deadline) : "-"}
        </td>

        <td className="px-4 py-3 text-center flex items-center justify-center gap-2 relative">
          <Link href={`/Applicationjob/${job.id}`}>
            <Eye className="w-4 h-4 text-green-600 hover:scale-110 cursor-pointer" />
          </Link>
          <Edit
            className="w-4 h-4 text-blue-600 hover:scale-110 cursor-pointer"
            onClick={() => setEditJob(job)}
          />
          <button
            onClick={() => handleToggleStatus(job)}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
              job.status === "Active"
                ? " text-yellow-800"
                : " text-green-800"
            }`}
          >
            {job.status === "Active" ? (
              <PauseCircle size={12}  />
            ) : (
              <PlayCircle size={12} />
            )}
            {job.status === "Active" ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => setShowConfirm(job.id)}
            className="text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1"
          >
            <Trash2 size={12} /> Delete
          </button>

          {/* delte  Popup */}
          {showConfirm === job.id && (
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center animate-fade-in">
              <div className="bg-white/30 backdrop-blur-md border border-white/20 p-4 rounded shadow w-64 transition">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete this job?
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      handleDelete(job.id);
                      setShowConfirm(null);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="bg-gray-300 px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </td>
      </tr>
    ))
  ) : jobs.length === 0 ? (
    
    <tr>
      <td colSpan="6" className="py-10">
        <div className="bg-white rounded-xl p-10 text-center col-span-full">
          <div className="flex justify-center items-center gap-2 mb-4 text-[#8B0000]">
            <Megaphone className="w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              No Job Postings
            </h2>
          </div>
          <p className="text-base text-gray-600 font-normal leading-relaxed mb-6 max-w-xl mx-auto">
            You haven't posted any jobs yet. Start attracting top ITI talents by
            posting your first job now.
          </p>
          <Link href="/PostJob">
            <button className="group inline-flex items-center gap-2 bg-gradient-to-br from-[#b30000] to-[#8B0000] hover:from-[#a00000] hover:to-[#750000] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]">
              <Plus className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90" />
              <span className="text-sm">Post Your First Job</span>
            </button>
          </Link>
        </div>
      </td>
    </tr>
  ) : (
    
    <tr>
      <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">
        No matching job postings found.
      </td>
    </tr>
  )}
</tbody>


          </table>
        </div>

        {editJob && (
          <JobForm
            mode="edit"
            job={editJob}
            onClose={() => setEditJob(null)}
          />
        )}

       {jobs.length > 0 && (
  <ReactPaginate
    breakLabel="..."
    nextLabel=">"
    previousLabel="<"
    onPageChange={({ selected }) => setCurrentPage(selected)}
    pageRangeDisplayed={3}
    marginPagesDisplayed={1}
    pageCount={pageCount}
    forcePage={currentPage}
    containerClassName="flex items-center justify-center mt-6 gap-2 text-sm"
    pageClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
    activeClassName="bg-[#b30000] text-white border-[#b30000]"
    previousClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
    nextClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
    breakClassName="px-2 py-1"
  />
)}
      </main>
    </div>
  );
}

function daysAgo(timestamp) {
  if (!timestamp) return "-";
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  const diff = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
}

function daysLeft(deadline) {
  const date = deadline.seconds
    ? new Date(deadline.seconds * 1000)
    : new Date(deadline);
  const diff = Math.ceil(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? `${diff} days left` : "Expired";
}










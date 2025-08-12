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

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const [editJob, setEditJob] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  // filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const categories = ["Design", "IT", "Marketing", "Finance", "HR"];

  const itemsPerPage = 6;
  const offset = currentPage * itemsPerPage;
  const currentJobs = filteredJobs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredJobs.length / itemsPerPage);

  useEffect(() => {
    if (!companyId) return;
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobsData = [];
      snapshot.forEach((docSnap) => {
        const job = { id: docSnap.id, ...docSnap.data() };
        if (job.companyId === companyId) {
          jobsData.push(job);
        }
      });
      const sorted = jobsData.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setJobs(sorted);
      setFilteredJobs(sorted);
    });
    return () => unsubscribe();
  }, [companyId]);

  useEffect(() => {
    let result = jobs;

    // Search filter
    if (search.trim() !== "") {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((job) => job.status === statusFilter);
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((job) => job.category === categoryFilter);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(
        (job) =>
          job.createdAt?.seconds * 1000 >= new Date(dateFrom).getTime()
      );
    }
    if (dateTo) {
      result = result.filter(
        (job) =>
          job.createdAt?.seconds * 1000 <= new Date(dateTo).getTime()
      );
    }

    setFilteredJobs(result);
    setCurrentPage(0);
  }, [search, statusFilter, categoryFilter, dateFrom, dateTo, jobs]);

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

  const stats = [
    {
      label: "All Jobs",
      count: jobs.length,
      icon: <Briefcase className="w-6 h-6 text-[#8B0000]" />,
      color: "bg-red-100",
      filter: "",
    },
    {
      label: "Active",
      count: jobs.filter((j) => j.status === "Active").length,
      icon: <PlayCircle className="w-6 h-6 text-green-600" />,
      color: "bg-green-100",
      filter: "Active",
    },
    {
      label: "Paused",
      count: jobs.filter((j) => j.status === "Paused").length,
      icon: <PauseCircle className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-100",
      filter: "Paused",
    },
    {
      label: "Closed",
      count: jobs.filter((j) => j.status === "Closed").length,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: "bg-red-200",
      filter: "Closed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Toaster position="bottom-right" />
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
            Job Posts Management
          </h1>
          <Link href="/PostJob">
            <button className="bg-[#b30000] hover:bg-[#8B0000] text-white px-4 py-2 rounded flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </Link>
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
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by title or category..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/6"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/6"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/6"
          />
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
              {currentJobs.length > 0 ? (
                currentJobs.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.category} • {daysAgo(job.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-blue-600 font-medium flex justify-center items-center gap-1">
                      <Users2 className="w-4 h-4" />{" "}
                      {job.applicationsCount || 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {job.salary || "-"}
                    </td>
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
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
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
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {job.status === "Active" ? (
                          <PauseCircle size={12} />
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
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No Job Postings
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








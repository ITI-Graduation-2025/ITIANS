"use client";

import React, { useEffect, useState } from "react";
import CompanyNavbar from "./CompanyNavbar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import Link from "next/link";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { Users, Clock, CheckCircle, XCircle, Search, Trash2 } from "lucide-react";

const STATUS_LIST = [
  { key: "all", label: "All Freelancers", icon: Users, color: "text-blue-600", bg: "bg-blue-600" },
  { key: "pending", label: "Pending Review", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500" },
  { key: "approved", label: "Approved", icon: CheckCircle, color: "text-green-600", bg: "bg-green-600" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-600" },
];

export default function AllCompanyApplicants() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, applicant: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, applicant: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState("");

  useEffect(() => {
    if (!companyId) return;

    const fetchJobsAndApplicants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        let applicants = [];

        for (const docSnap of querySnapshot.docs) {
          const job = docSnap.data();
          const jobId = docSnap.id;

          if (job.postedBy === companyId) {
            const applicantEntries = job.applicants || [];

            const applicantData = await Promise.all(
              applicantEntries.map(async (entry) => {
                const userId = typeof entry === "string" ? entry : entry.userId;
                const status =
                  typeof entry === "object" && entry.status
                    ? entry.status.toLowerCase().trim()
                    : "pending";

                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) return null;

                return {
                  id: userId,
                  status,
                  jobId,
                  skills: userSnap.data().skills || [],
                  gradStatus: userSnap.data().gradStatus || "ITI Graduate",
                  ...userSnap.data(),
                  jobTitle: job.title || "Untitled Job",
                };
              })
            );

            applicants = applicants.concat(applicantData.filter(Boolean));
          }
        }

        setApplications(applicants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setLoading(false);
      }
    };

    fetchJobsAndApplicants();
  }, [companyId]);

  const handleUpdateStatus = async (jobId, userId, newStatus, name) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) return;

      const jobData = jobSnap.data();
      const updatedApplicants = jobData.applicants.map((applicant) => {
        if (typeof applicant === "string") {
          return applicant === userId
            ? { userId, status: newStatus.toLowerCase() }
            : { userId: applicant, status: "pending" };
        }
        if (applicant.userId === userId) {
          return { ...applicant, status: newStatus.toLowerCase() };
        }
        return applicant;
      });

      await updateDoc(jobRef, { applicants: updatedApplicants });

      toast.success(`${name} has been ${newStatus}`, {
        style: {
          background: newStatus === "approved" ? "#dcfce7" : "#fee2e2",
          color: newStatus === "approved" ? "#166534" : "#991b1b",
        },
      });

      setApplications((prev) =>
        prev.map((a) =>
          a.id === userId && a.jobId === jobId
            ? { ...a, status: newStatus.toLowerCase() }
            : a
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update applicant status.");
    }
  };

  const handleDeleteApplicant = async (jobId, userId, name) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) return;

      const jobData = jobSnap.data();
      const updatedApplicants = jobData.applicants.filter((applicant) =>
        typeof applicant === "string"
          ? applicant !== userId
          : applicant.userId !== userId
      );

      await updateDoc(jobRef, { applicants: updatedApplicants });

      toast.success(`${name} has been deleted.`);

      setApplications((prev) =>
        prev.filter((a) => !(a.id === userId && a.jobId === jobId))
      );
    } catch (err) {
      console.error("Failed to delete applicant:", err);
      toast.error("Failed to delete applicant.");
    }
  };

  const filteredApplicants =
    tab === "all"
      ? applications
      : applications.filter((a) => (a.status?.toLowerCase() || "pending") === tab);

  const searchFilteredApplicants = filteredApplicants.filter((a) =>
    a.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="sticky top-0 z-50">
        <CompanyNavbar />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 min-h-screen bg-white/70 backdrop-blur-md border-r border-gray-200 p-6 space-y-8 shadow-lg">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-wide">
              Freelancer Management
            </h1>
            <p className="text-sm text-gray-600">
              Review and approve freelancer applications
            </p>
          </div>

          <section>
            <div className="flex flex-col gap-3">
              {STATUS_LIST.map((s) => {
                const Icon = s.icon;
                const isActive = tab === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setTab(s.key)}
                    className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold transition-shadow duration-300
                      ${
                        isActive
                          ? `${s.bg} shadow-md text-white flex-row-reverse gap-4`
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                      } cursor-pointer `}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : s.color
                        }`}
                      />
                      {s.label}
                    </span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full
                        ${
                          isActive
                            ? " bg-opacity-30 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                    >
                      {s.key === "all"
                        ? applications.length
                        : s.key === "pending"
                        ? applications.filter((a) => a.status === "pending").length
                        : s.key === "approved"
                        ? applications.filter((a) => a.status === "approved").length
                        : applications.filter((a) => a.status === "rejected").length}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-auto text-xs text-gray-400 text-center">
            © 2025 Your Company
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold">All Job Applications</h2>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dropdown */}
              <select
                value={selectedApplicant}
                onChange={(e) => setSelectedApplicant(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Select applicant</option>
                {searchFilteredApplicants.map((a) => (
                  <option key={a.id + a.jobId} value={a.id + "|" + a.jobId}>
                    {a.name} ({a.jobTitle})
                  </option>
                ))}
              </select>

              {/* Delete Button */}
              <button
                disabled={!selectedApplicant}
                onClick={() => {
                  const [userId, jobId] = selectedApplicant.split("|");
                  const applicant = searchFilteredApplicants.find(
                    (a) => a.id === userId && a.jobId === jobId
                  );
                  setDeleteModal({ show: true, applicant });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  selectedApplicant
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Trash2 className="w-4 h-4" /> Delete Applicant
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow flex gap-4 animate-pulse"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : searchFilteredApplicants.length > 0 ? (
            <div className="space-y-4">
              {searchFilteredApplicants.map((applicant) => {
                return (
                  <div
                    key={applicant.id + applicant.jobId}
                    className="bg-white p-5 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition"
                  >
                    {/* Left: Image + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Image
                        src={applicant.profileImage || "/default-avatar.png"}
                        alt={applicant.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover flex-shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {applicant.name}
                          </h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">
                            {applicant.mainTrack
                              ? `Main Track: ${applicant.mainTrack}`
                              : "No Track Assigned"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-md">
                          Applied for:{" "}
                          <span className="font-medium">
                            {applicant.jobTitle}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1 max-w-md">
                          {applicant.skills?.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-end gap-2 min-w-[130px]">
                      <div className="flex gap-4 text-sm whitespace-nowrap">
                        <Link
                          href={`/profile/${applicant.id || applicant.uid}`}
                          className="text-indigo-600 hover:underline"
                        >
                          View Profile
                        </Link>
                        {applicant.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  action: "approved",
                                  applicant,
                                })
                              }
                              className="text-green-600 hover:underline font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  action: "rejected",
                                  applicant,
                                })
                              }
                              className="text-red-600 hover:underline font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(applicant.status === "approved" ||
                          applicant.status === "rejected") && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              applicant.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {applicant.status.charAt(0).toUpperCase() +
                              applicant.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No applicants found.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal (Approve/Reject) */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Confirm {confirmModal.action === "approved" ? "Approve" : "Reject"}?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {confirmModal.action}{" "}
              {confirmModal.applicant.name}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ show: false, action: null, applicant: null })
                }
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(
                    confirmModal.applicant.jobId,
                    confirmModal.applicant.id,
                    confirmModal.action,
                    confirmModal.applicant.name
                  );
                  setConfirmModal({ show: false, action: null, applicant: null });
                }}
                className={`px-4 py-2 rounded text-white ${
                  confirmModal.action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Delete Applicant?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteModal.applicant?.name}</span>{" "}
              from this job?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, applicant: null })}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteApplicant(
                    deleteModal.applicant.jobId,
                    deleteModal.applicant.id,
                    deleteModal.applicant.name
                  );
                  setDeleteModal({ show: false, applicant: null });
                  setSelectedApplicant("");
                }}
                className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}











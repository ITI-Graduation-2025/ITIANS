"use client";

import React, { useEffect, useState } from "react";
import CompanyNavbar from "./CompanyNavbar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import Link from "next/link";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { Users, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useParams } from "next/navigation";

const STATUS_LIST = [
  { key: "all", label: "All Applicants", icon: Users, color: "text-blue-600", bg: "bg-blue-600" },
  { key: "pending", label: "Pending Review", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500" },
  { key: "approved", label: "Approved", icon: CheckCircle, color: "text-green-600", bg: "bg-green-600" },
  { key: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-600" },
];

const STATUS_BADGES = {
  pending: { text: "New", bg: "bg-blue-100 text-blue-700" },
  approved: { text: "Approved", bg: "bg-green-100 text-green-700" },
  rejected: { text: "Reviewed", bg: "bg-yellow-100 text-yellow-700" },
};

export default function CompanyApplications() {
  const { data: session } = useSession();
  const companyId = session?.user?.id; 
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, applicant: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitle, setJobTitle] = useState("Job");
  const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";


  
useEffect(() => {
  if (!jobId) return;
  setLoading(true);

  const jobRef = doc(db, "jobs", jobId);
  const unsub = onSnapshot(jobRef, async (jobSnap) => {
    if (!jobSnap.exists()) {
      toast.error("Job not found.");
      setApplications([]);
      setLoading(false);
      return;
    }

    const jobData = jobSnap.data();
    setJob(jobData); // ✅ هنا ضيفناها
    setJobTitle(jobData?.title || "Job");

    const applicantEntries = jobData.applicants || [];
    const applicantData = await Promise.all(
      applicantEntries.map(async (entry) => {
        const userId = typeof entry === "string" ? entry : entry.userId;
        const status =
          typeof entry === "object" && entry.status
            ? String(entry.status).toLowerCase().trim()
            : "pending";

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return null;

        const u = userSnap.data() || {};
        return {
          id: userId,
          status,
          jobId,
          jobTitle: jobData?.title || "Untitled Job",
          name: u.name || u.fullName || "Unnamed Applicant",
          profileImage: u.profileImage || u.image || "/default-avatar.png",
          skills: u.skills || [],
          mainTrack: u.mainTrack,
          location: u.location,
          gradStatus: u.gradStatus || "ITI Graduate",
          ...u,
        };
      })
    );

    setApplications(applicantData.filter(Boolean));
    setLoading(false);
  });

  return () => unsub();
}, [jobId]);

  const handleUpdateStatus = async (userId, newStatus, name) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) return;

      const jobData = jobSnap.data();
      const updatedApplicants = (jobData.applicants || []).map((applicant) => {
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
          a.id === userId ? { ...a, status: newStatus.toLowerCase() } : a
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update applicant status.");
    }
  };

  
  const filteredApplicants =
    tab === "all"
      ? applications
      : applications.filter((a) => (a.status?.toLowerCase() || "pending") === tab);

  const searchFilteredApplicants = filteredApplicants.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      (a.name || "").toLowerCase().includes(term) ||
      (a.skills || []).some((s) => String(s).toLowerCase().includes(term))
    );
  });

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
              Review and approve applications for
              <span className="font-semibold"> {jobTitle}</span>
            </p>
          </div>

          <section>
            <div className="flex flex-col gap-3">
              {STATUS_LIST.map((s) => {
                const Icon = s.icon;
                const isActive = tab === s.key;
                const count =
                  s.key === "all"
                    ? applications.length
                    : applications.filter((a) => (a.status?.toLowerCase() || "pending") === s.key).length;

                return (
                  <button
                    key={s.key}
                    onClick={() => setTab(s.key)}
                    className={`flex items-center justify-between px-5 py-3 rounded-lg font-semibold transition-shadow duration-300
                      ${
                        isActive
                          ? `${s.bg} shadow-md text-white flex-row-reverse gap-4`
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                      } cursor-pointer`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : s.color}`} />
                      {s.label}
                    </span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isActive ? " bg-opacity-30 text-white" : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-auto text-xs text-gray-400 text-center">© 2025 Your Company</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h1 className="text-xl font-bold text-gray-800">
  {capitalize(job?.title) } Job Applications
</h1>



            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow flex gap-4 animate-pulse">
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
                const status = (applicant.status || "pending").toLowerCase();
                return (
                  <div
                    key={applicant.id}
                    className="bg-white p-5 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition"
                  >
                    {/* Left: Image + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Image
                        src={applicant.profileImage || "/default-avatar.png"}
                        alt={applicant.name || "Applicant"}
                        width={56}
                        height={56}
                        className="rounded-full object-cover flex-shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{applicant.name}</h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">
                            {applicant.mainTrack ? `Main Track: ${applicant.mainTrack}` : "No Track Assigned"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate max-w-md">
                          Applied for: <span className="font-medium">{jobTitle}</span>
                        </p>
                        

                        <div className="flex flex-wrap gap-2 mt-1 max-w-md">
                          {applicant.skills?.map((skill) => (
                            <span key={skill} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
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
                          href={`/applicant/${applicant.id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          View Profile
                        </Link>

                        {status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                setConfirmModal({ show: true, action: "approved", applicant })
                              }
                              className="text-green-600 hover:underline font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({ show: true, action: "rejected", applicant })
                              }
                              className="text-red-600 hover:underline font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(status === "approved" || status === "rejected") && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Confirm {confirmModal.action === "approved" ? "Approve" : "Reject"}?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {confirmModal.action}{" "}
              {confirmModal.applicant?.name}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, action: null, applicant: null })}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(
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
    </div>
  );
}





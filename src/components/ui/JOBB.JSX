"use client";

import { useEffect, useState } from "react";
import CompanyNavbar from "./CompanyNavbar";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "./JobForm";
import { useSession } from "next-auth/react";

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const { data: session } = useSession();

 const companyId = session?.user?.id;
  const companyRef = companyId ? doc(db, "users", companyId) : null;

  useEffect(() => {
    if (!companyId) return;

    const unsubscribe = onSnapshot(collection(db, "jobs"), async (snapshot) => {
      const now = new Date();
      const jobsData = [];

      snapshot.forEach((docSnap) => {
        const job = { id: docSnap.id, ...docSnap.data() };
        const deadlineDate = job.deadline?.seconds
          ? new Date(job.deadline.seconds * 1000)
          : null;

        if (job.status !== "Closed" && deadlineDate && deadlineDate < now) {
          job.status = "Closed";
        }

        if (job.companyId === companyId) {
          jobsData.push(job);
        }
      });

      setJobs(jobsData);

      if (companyRef) {
        const activeCount = jobsData.filter((j) => j.status === "Active").length;
        await updateDoc(companyRef, { activeJobs: activeCount });
      }
    });

    return () => unsubscribe();
  }, [companyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f2] to-[#ffe8e0]">
      <Toaster position="bottom-right" />
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Company Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600 transition">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="border-b-2 border-red-500 px-4 py-2 flex items-center gap-1 text-red-600 font-medium">
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <Link href="/Applicationjob" className="text-gray-600 hover:text-red-600 px-4 py-2 flex items-center gap-1 transition">
            <FileText className="w-4 h-4" /> Applications
          </Link>
          <Link href="/companyprofile" className="text-gray-600 px-4 py-2 font-medium flex items-center gap-1 hover:text-red-600 transition">
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Job Postings</h2>
          <Link href="/PostJob">
            <button className="bg-red-600 text-white px-4 py-2 rounded text-sm shadow hover:bg-red-700 transition">
              + Post New Job
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge label="All Jobs" count={jobs.length} color="red" />
          <StatusBadge label="Active" count={jobs.filter((j) => j.status === "Active").length} color="green" />
          <StatusBadge label="Paused" count={jobs.filter((j) => j.status === "Paused").length} color="yellow" />
          <StatusBadge label="Closed" count={jobs.filter((j) => j.status === "Closed").length} color="gray" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} {...job} companyRef={companyRef} onEdit={() => setEditJob(job)} />
            ))
          ) : (
            <div className="bg-white shadow-sm rounded p-6 text-center text-gray-600 col-span-full">
              <p className="mb-4 text-lg">You haven't posted any jobs yet.</p>
              <p className="text-sm mb-4">
                Start attracting top ITI talents by posting your first job now.
              </p>
              <Link href="/PostJob">
                <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
                  + Post Your First Job
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {editJob && <JobForm mode="edit" job={editJob} onClose={() => setEditJob(null)} />}
    </div>
  );
}

function StatusBadge({ label, count, color }) {
  const bg = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    gray: "bg-gray-100 text-gray-600",
  }[color];

  return <span className={`px-2 py-1 rounded text-xs ${bg}`}>{label} ({count})</span>;
}

function JobCard({
  id,
  title,
  location,
  type,
  salary,
  status,
  companyRef,
  applicationsCount,
  views,
  postedAt,
  deadline,
  onEdit,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate?.() || new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  const addActivity = async (activity) => {
    if (!companyRef) return;
    await updateDoc(companyRef, {
      recentActivities: arrayUnion({
        type: activity.type,
        text: activity.text,
        detail: activity.detail,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const handlePause = async () => {
    try {
      await updateDoc(doc(db, "jobs", id), { status: "Paused" });
      await addActivity({ type: "status", text: `Paused job: ${title}`, detail: "" });
      toast.success("Job paused successfully");
    } catch {
      toast.error("Error pausing job");
    }
  };

  const handleResume = async () => {
    try {
      await updateDoc(doc(db, "jobs", id), { status: "Active" });
      await addActivity({ type: "status", text: `Resumed job: ${title}`, detail: "" });
      toast.success("Job resumed successfully");
    } catch {
      toast.error("Error resuming job");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      await addActivity({ type: "delete", text: `Deleted job: ${title}`, detail: "" });
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Error deleting job");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 relative transition-transform hover:scale-105 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{location} • {type} • {salary}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          status === "Active" ? "bg-green-100 text-green-700"
          : status === "Paused" ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-600"
        }`}>
          {status}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap mt-3 text-xs">
        <div className="bg-blue-50 px-2 py-1 rounded">{applicationsCount || 0} Applications</div>
        <div className="bg-green-50 px-2 py-1 rounded">{views || 0} Views</div>
        <div className="bg-yellow-50 px-2 py-1 rounded">Posted: {formatDate(postedAt)}</div>
        <div className="bg-red-50 px-2 py-1 rounded">Deadline: {formatDate(deadline)}</div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          View Applications
        </button>

        {status === "Active" && (
          <button onClick={handlePause} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">
            <PauseCircle size={12} /> Pause
          </button>
        )}

        {status === "Paused" && (
          <button onClick={handleResume} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1">
            <PlayCircle size={12} /> Resume
          </button>
        )}

        <button onClick={onEdit} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">
          <Edit size={12} /> Edit
        </button>

        <button onClick={() => setShowConfirm(true)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">
          <Trash2 size={12} /> Delete
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center animate-fade-in">
          <div className="bg-white/30 backdrop-blur-md border border-white/20 p-4 rounded shadow w-64 transition">
            <p className="text-sm text-gray-700">Are you sure you want to delete this job?</p>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => { handleDelete(); setShowConfirm(false); }} className="bg-red-600 text-white px-3 py-1 rounded text-xs">
                Yes, Delete
              </button>
              <button onClick={() => setShowConfirm(false)} className="bg-gray-300 px-3 py-1 rounded text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

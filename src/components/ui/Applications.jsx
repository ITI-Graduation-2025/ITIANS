"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CompanyNavbar from "./CompanyNavbar";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users2,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const STATUS_LIST = ["pending", "shortlisted", "interviewed", "rejected"];

const ApplicantCard = ({ applicant, onUpdateStatus, onViewProfile }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl mb-4 bg-white shadow-sm">
    <div className="flex items-start space-x-4">
      <Image
        src={applicant.image || "/default-avatar.png"}
        alt={applicant.name}
        width={48}
        height={48}
        className="rounded-full"
        loading="lazy"
      />
      <div>
        <h3 className="font-semibold text-lg">{applicant.name}</h3>
        <p className="text-gray-600 text-sm">Applied for: {applicant.role}</p>
        <p className="text-xs text-gray-500">Status: {applicant.status}</p>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-red-600" /> {applicant.experience}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-600" /> {applicant.location}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {applicant.skills?.map((skill) => (
            <span key={skill} className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Applied on {applicant.date}</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0">
      <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
        <Star className="w-4 h-4" /> {applicant.rating}/5
      </span>
      <button onClick={() => onViewProfile(applicant)} className="bg-red-600 text-white px-4 py-2 rounded">View Profile</button>
      <button
        onClick={() => onUpdateStatus(applicant.id, "shortlisted", applicant.name)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Shortlist
      </button>
      <button
        onClick={() => {
          if (confirm("Are you sure you want to reject this applicant?")) {
            onUpdateStatus(applicant.id, "rejected", applicant.name);
          }
        }}
        className="bg-gray-300 text-black px-4 py-2 rounded"
      >
        Reject
      </button>
      <button className="border px-4 py-2 rounded flex items-center gap-1">
        <MessageCircle className="w-4 h-4" /> Message
      </button>
    </div>
  </div>
);

export default function CompanyApplications() {
  const [tab, setTab] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobAllowed, setJobAllowed] = useState(true);
  const modalRef = useRef(null);
  const { jobId } = useParams();
  const { data: session } = useSession();

  // ✅ تحقق من ملكية الوظيفة
  useEffect(() => {
    const checkJobOwnership = async () => {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        const jobData = jobSnap.data();
        if (jobData.companyId !== session?.user?.id) {
          toast.error("You do not have access to this job's applications.");
          setJobAllowed(false);
        }
      }
    };
    if (jobId && session?.user?.id) {
      checkJobOwnership();
    }
  }, [jobId, session]);

  useEffect(() => {
    if (!jobId || !jobAllowed) return;
    const q = query(
      collection(db, "applications"),
      where("status", "==", tab),
      where("jobId", "==", jobId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    });
    return () => unsubscribe();
  }, [tab, jobId, jobAllowed]);

  useEffect(() => {
    if (!jobId || !jobAllowed) return;
    const unsubscribers = STATUS_LIST.map((status) => {
      const q = query(
        collection(db, "applications"),
        where("status", "==", status),
        where("jobId", "==", jobId)
      );
      return onSnapshot(q, (snapshot) => {
        setStatusCounts((prev) => ({ ...prev, [status]: snapshot.size }));
      });
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [jobId, jobAllowed]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedApplicant(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedApplicant(null);
    }
  };

  const handleUpdateStatus = async (id, newStatus, name) => {
    const docRef = doc(db, "applications", id);
    await updateDoc(docRef, { status: newStatus });
    toast.success(`${name} has been ${newStatus}`);
  };

  if (!jobAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Access Denied
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f2]" onClick={selectedApplicant ? handleOutsideClick : null}>
      <Toaster />
      <CompanyNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Company Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your job postings and find the best ITI talent</p>

        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <button className="border-b-2 border-red-500 text-red-600 px-4 py-2 font-medium flex items-center gap-1">
            <Users2 className="w-4 h-4" /> Applications
          </button>
          <Link href="/companyprofile" className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

        <h2 className="text-lg font-semibold mb-3">Job Applications</h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_LIST.map((status) => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`px-3 py-1 rounded text-sm ${
                tab === status ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>

        <div>
          {applications.length > 0 ? (
            applications.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onUpdateStatus={handleUpdateStatus}
                onViewProfile={setSelectedApplicant}
              />
            ))
          ) : (
            <p className="text-gray-500">No applications in this category.</p>
          )}
        </div>
      </main>

      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative" ref={modalRef}>
            <button onClick={() => setSelectedApplicant(null)} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <Image
                src={selectedApplicant.image}
                alt={selectedApplicant.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedApplicant.name}</h2>
                <p className="text-sm text-gray-500">{selectedApplicant.role}</p>
                <p className="text-xs text-gray-400 mt-1">Status: {selectedApplicant.status}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">{selectedApplicant.bio || "No additional info."}</p>
          </div>
        </div>
      )}
    </div>
  );
}


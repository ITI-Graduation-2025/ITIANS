"use client";

import React, { useEffect, useState } from "react";
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
  X,
  AlertCircle,
    CheckCircle,  
    Ban, 
    Eye, 
    XCircle,
    ClipboardList,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

const STATUS_LIST = ["pending", "approved", "rejected"];

const STATUS_ICONS = {
  pending: <AlertCircle className="w-4 h-4 text-yellow-500" />,  
  approved: <CheckCircle className="w-4 h-4 text-green-600" />,  
  rejected: <Ban className="w-4 h-4 text-red-600" />,           
};


const ApplicantCard = ({ applicant, onUpdateStatus, onViewProfile, setSelectedToReject, setShowRejectModal }) => {
  const status = applicant.status?.toLowerCase() || "pending";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-xl shadow-sm mb-4 hover:shadow-lg">
  <div className="flex items-start space-x-4">
    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#b30000]">
      <Image
        src={applicant.image || "/default-avatar.png"}
        alt={applicant.name || "Applicant"}
        fill
        className="object-cover"
      />
    </div>
    <div>
      <h3 className="font-semibold text-lg text-gray-900">{applicant.name || "Unnamed Applicant"}</h3>
      <p className="text-gray-600 text-sm mt-1">Applied for: <span className="font-medium">{applicant.jobTitle || "Not specified"}</span></p>
      <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
        Status: <span className={`font-semibold capitalize ${status === 'approved' ? 'text-green-600' : status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
          {status}
        </span>
      </p>
      <div className="flex flex-wrap text-gray-500 mt-2 gap-4 text-sm">
        {applicant.experience && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#b30000]" /> {applicant.experience}
          </div>
        )}
        {applicant.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#b30000]" /> {applicant.location}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {applicant.skills?.map((skill) => (
          <span
            key={skill}
            className="bg-[#b30000] bg-opacity-10 text-[#b30000] px-3 py-1 rounded-full font-semibold select-none"
          >
            {skill}
          </span>
        ))}
      </div>
      {applicant.date && (
        <p className="text-xs text-gray-400 mt-2 italic">Applied on {applicant.date}</p>
      )}
    </div>
  </div>
  <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
    {applicant.rating && (
      <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
        <Star className="w-5 h-5" /> {applicant.rating}/5
      </span>
    )}

    <button
  onClick={() => onViewProfile(applicant)}
  className="bg-[#b30000] hover:bg-[#8B0000] transition-colors text-white px-5 py-2 rounded-md shadow-md flex items-center gap-2"
>
  <Eye className="w-4 h-4" />
  View Profile
</button>


   {status !== "approved" && (
  <button
    onClick={() =>
      onUpdateStatus(applicant.jobId, applicant.id, "approved", applicant.name)
    }
    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-2 rounded-md shadow-md flex items-center gap-2"
  >
    <CheckCircle className="w-4 h-4" />
    Approve
  </button>
)}

   {status !== "rejected" && (
     <button
       onClick={() => {
         setSelectedToReject(applicant); 
         setShowRejectModal(true);       
       }}
       className="bg-gray-300 hover:bg-gray-400 transition-colors text-black px-5 py-2 rounded-md shadow-md flex items-center gap-2"
     >
       <XCircle className="w-4 h-4" />
       Reject
     </button>
   )}

  </div>
</div>

  );
};

export default function AllCompanyApplicants() {
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [hasAccessToJob, setHasAccessToJob] = useState(true);
  const companyId = session?.user?.id;
  const [applications, setApplications] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedToReject, setSelectedToReject] = useState(null);

  const [company, setCompany] = useState(null);
    useEffect(() => {
      const fetchCompany = async () => {
        if (!companyId) return;
        try {
          const docRef = doc(db, "users", companyId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCompany(data);
          } else {
            console.warn("Company document not found");
          }
        } catch (err) {
          console.error("Error fetching company:", err);
        }
      };
  
      fetchCompany();
    }, [companyId]);

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
                  jobTitle: job.title,
                  ...userSnap.data(),
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

      toast.success(`${name} has been ${newStatus}`);
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

  if (!hasAccessToJob) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Access Denied
      </div>
    );
  }

  const filteredApplicants = applications.filter(
    (a) => (a.status?.toLowerCase() || "pending") === tab
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Toaster />
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
          {company?.name} <span className="text-[#203947] text-2xl">Dashboard</span>
        </h1>
       </div>
        <p className="text-gray-600 mb-6">Manage your job postings and find the best ITI talent</p>

        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="px-4 py-2 flex items-center gap-1 text-[#203947] font-medium hover:text-[#b30000] transition">
                      <LayoutDashboard className="w-4 h-4" /> Overview
                    </Link>
                    <Link href="/companyjobs" className="  px-4 py-2 flex items-center gap-1  text-[#203947] font-medium hover:text-[#b30000] transition">
                      <FileText className="w-4 h-4" /> My Jobs
                    </Link>
                   <button className="border-b-2 border-[#b30000] text-[#b30000] px-4 py-2 font-medium flex items-center gap-1">
                  <Users2 className="w-4 h-4" /> Applications
                        </button>
          
                    <Link href="/companyprofile" className="text-[#203947] px-4 py-2 font-medium flex items-center gap-1 hover:text-[#b30000] transition">
                      <Building2 className="w-4 h-4" /> Company Profile
                    </Link>
        </div>

        <div className="mb-6 border-b border-gray-300 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* العنوان والوصف */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="text-[#b30000] w-5 h-5" />
               
                <span className="text-xl md:text-xl font-semibold text-[#203947] ">All Job Applications</span>
              </h2>
              <p className="text-sm text-gray-800 mt-1 font-[Poppins]">
          Track and manage all applicants across your active jobs.
        </p>
            </div>
        
            {/* زر الرجوع */}
           <Link
          href="/companyjobs"
          className="inline-flex items-center gap-2 text-sm font-medium bg-[#203947] text-white border  px-4 py-2 rounded-lg hover:bg-[#b30000] hover:text-white transition-colors duration-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
          </div>
        </div>


        
        <div className="mb-6 flex flex-wrap gap-2">
  {STATUS_LIST.map((status) => (
    <button
      key={status}
      onClick={() => setTab(status)}
      className={`
        flex items-center gap-1 px-3 py-1.5
        rounded-md
        font-semibold text-xs
        transition-all duration-300 ease-in-out
        ${
          tab === status
            ? "bg-[#b30000] text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-[#b30000] hover:text-white"
        }
        focus:outline-none focus:ring-1 focus:ring-[#b30000] focus:ring-opacity-50
      `}
    >
      {STATUS_ICONS[status.toLowerCase()]} 
      {status.charAt(0).toUpperCase() + status.slice(1)} (
      {applications.filter(
        (a) => (a.status?.toLowerCase() || "pending") === status.toLowerCase()
      ).length}
      )
    </button>
  ))}
</div>




        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-24 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id + applicant.jobId}
              applicant={applicant}
              onUpdateStatus={handleUpdateStatus}
              onViewProfile={setSelectedApplicant}
              setSelectedToReject={setSelectedToReject}
               setShowRejectModal={setShowRejectModal}
            />
          ))
        ) : (
          <p className="text-gray-500">No applications in this category.</p>
        )}
      </main>

     {selectedApplicant && (
  <div className="fixed inset-0  bg-black/40 bg-opacity-20 flex justify-center items-center z-50 p-4">

    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative overflow-hidden">
      <button
        onClick={() => setSelectedApplicant(null)}
        aria-label="Close profile modal"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-center p-8 pt-12">
        <div className="w-28 h-28 relative rounded-full overflow-hidden shadow-lg ring-2 ring-[#b30000]">
          <Image
            src={selectedApplicant.image || "/default-avatar.png"}
            alt={selectedApplicant.name}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">{selectedApplicant.name}</h2>
        <p className="mt-1 text-sm text-red-700 font-medium">{selectedApplicant.role || "Role not specified"}</p>
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide font-semibold">
          Status: <span className="capitalize">{selectedApplicant.status}</span>
        </p>
        <p className="mt-6 text-center text-gray-700 text-sm leading-relaxed">
          {selectedApplicant.bio || "No additional info."}
        </p>
        <Link
          href={`/applicant/${selectedApplicant.id}`}
          className="mt-6 px-6 py-2 bg-[#b30000] text-white rounded-md hover:bg-[#8B0000] transition"
          onClick={() => setSelectedApplicant(null)}
        >
          View Full Profile
        </Link>
      </div>
    </div>
  </div>
)}

 {showRejectModal && selectedToReject && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Reject Applicant</h2>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to reject{" "}
        <span className="font-medium text-[#b30000]">{selectedToReject.name || "this applicant"}</span>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowRejectModal(false)}
          className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full shadow-sm hover:bg-gray-200 hover:text-black transition"
        >
          Cancel
        </button>

        <button
          onClick={() => {
               handleUpdateStatus(selectedToReject.jobId, selectedToReject.id, "rejected", selectedToReject.name || "The applicant");
            setShowRejectModal(false);
            setSelectedToReject(null);
          }}
          className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
}

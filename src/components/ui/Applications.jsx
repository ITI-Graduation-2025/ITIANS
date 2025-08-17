"use client";

import { db } from "@/config/firebase";
import {
  approveJobApplication,
  completeJob,
  rejectJobApplication,
} from "@/services/jobServices";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  LayoutDashboard,
  MapPin,
  Star,
  UserCheck,
  Users2,
  X,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CompanyNavbar from "./CompanyNavbar";

const STATUS_LIST = ["pending", "approved", "rejected"];

const STATUS_ICONS = {
  pending: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  approved: <CheckCircle className="w-4 h-4 text-green-600" />,
  rejected: <Ban className="w-4 h-4 text-red-600" />,
};

const ApplicantCard = ({
  applicant,
  onUpdateStatus,
  onViewProfile,
  setSelectedToReject,
  setShowRejectModal,
  job,
}) => {
  const status = applicant.status?.toLowerCase() || "pending";
  console.log(job);
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-xl shadow-sm mb-4 hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#b30000]">
          <Image
            src={applicant.profileImage || "/default-avatar.png"}
            alt={
              typeof applicant.name === "string"
                ? applicant.name
                : applicant.name?.value || "Applicant"
            }
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {typeof applicant.name === "string"
              ? applicant.name
              : applicant.name?.value || "Unnamed Applicant"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Applied for:{" "}
            <span className="font-medium">
              {typeof applicant.jobTitle === "string"
                ? applicant.jobTitle
                : applicant.jobTitle?.value || "Not specified"}
            </span>
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
            Status:{" "}
            <span
              className={`font-semibold capitalize ${status === "approved" ? "text-green-600" : status === "rejected" ? "text-red-600" : "text-yellow-600"}`}
            >
              {status}
            </span>
          </p>
          <div className="flex flex-wrap text-gray-500 mt-2 gap-4 text-sm">
            {applicant.experience && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#b30000]" />
                {typeof applicant.experience === "string"
                  ? applicant.experience
                  : applicant.experience?.value || "Experience"}
              </div>
            )}
            {applicant.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#b30000]" />
                {typeof applicant.location === "string"
                  ? applicant.location
                  : applicant.location?.value || "Location"}
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {applicant.skills?.map((skill, index) => {
              // Handle both string skills and object skills with value property

              return (
                <span
                  key={index}
                  className="bg-[#b30000] bg-opacity-10 !text-[#fff] px-3 py-1 rounded-full font-semibold select-none"
                >
                  {skill}
                </span>
              );
            })}
          </div>
          {applicant.date && (
            <p className="text-xs text-gray-400 mt-2 italic">
              Applied on{" "}
              {typeof applicant.date === "string"
                ? applicant.date
                : applicant.date?.value || "Unknown date"}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
        {applicant.rating && (
          <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
            <Star className="w-5 h-5" />
            {typeof applicant.rating === "number"
              ? applicant.rating
              : applicant.rating?.value || 0}
            /5
          </span>
        )}

        {job.status === "underReview" && <button
          onClick={() =>
            completeJob(
              job.id,
              job.approvedFreelancerId,
              job.company,
              job.title,
            )
          }
          className="bg-[#0a0]  transition-colors text-white px-5 py-2 rounded-md shadow-md flex items-center gap-2"
        >
          Mark As Completed
        </button>}
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
              onUpdateStatus(
                applicant.id,
                "approved",
                applicant.name || "The applicant",
              )
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

export default function CompanyApplications() {
  const [tab, setTab] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef(null);
  const { jobId } = useParams();
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const [company, setCompany] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [job, setJob] = useState();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedToReject, setSelectedToReject] = useState(null);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      try {
        const docRef = doc(db, "users", companyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompany(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    fetchCompany();
  }, [companyId]);

  // Fetch job applicants
  useEffect(() => {
    if (!jobId) return;
    setIsLoading(true);

    const jobRef = doc(db, "jobs", jobId);
    const unsubscribe = onSnapshot(jobRef, async (jobSnap) => {
      if (!jobSnap.exists()) {
        toast.error("Job not found.");
        setIsLoading(false);
        return;
      }

      const jobData = jobSnap.data();
      const applicantEntries = jobData.applicants || [];
      setJobTitle(jobData.title || "Job");
      setJob({id:jobId, ...jobData });

      const applicantData = await Promise.all(
        applicantEntries.map(async (entry) => {
          const userId = typeof entry === "string" ? entry : entry.userId;
          const status = (
            typeof entry === "object" && entry.status ? entry.status : "pending"
          ).toLowerCase();

          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          const jobTitle = jobSnap.data().title;

          if (!userSnap.exists()) return null;

          return {
            id: userId,
            status,
            jobTitle,
            ...userSnap.data(),
          };
        }),
      );

      setApplications(applicantData.filter(Boolean));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [jobId]);

  const handleUpdateStatus = async (userId, newStatus, name) => {
    try {
      if (newStatus.toLowerCase() === "approved") {
        // Use the new job service for approval
        await approveJobApplication(
          jobId,
          userId,
          company?.name || "Company",
          jobTitle,
        );
        toast.success(`${name} has been approved! Job is now in progress.`);
      } else if (newStatus.toLowerCase() === "rejected") {
        // Use the new job service for rejection
        await rejectJobApplication(
          jobId,
          userId,
          company?.name || "Company",
          jobTitle,
        );
        toast.success(`${name} has been rejected.`);
      } else {
        // Handle other status updates (fallback to old method)
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
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update applicant status.");
    }
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedApplicant(null);
    }
  };

  // Filter applicants for current tab
  const filteredApplicants = applications.filter(
    (a) => (a.status?.toLowerCase() || "pending") === tab.toLowerCase(),
  );

  return (
    <div
      className="min-h-screen bg-[#f9f9f9]"
      onClick={selectedApplicant ? handleOutsideClick : null}
    >
      <Toaster />
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
            {company?.name}{" "}
            <span className="text-[#203947] text-2xl">Dashboard</span>
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        <div className="flex gap-4 border-b mb-6">
          <Link
            href="/dashboardCompany"
            className="px-4 py-2 flex items-center gap-1 text-[#203947] font-medium hover:text-[#b30000] transition"
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link
            href="/companyjobs"
            className="px-4 py-2 flex items-center gap-1 text-[#203947] font-medium hover:text-[#b30000] transition"
          >
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <button className="border-b-2 border-[#b30000] text-[#b30000] px-4 py-2 font-medium flex items-center gap-1">
            <Users2 className="w-4 h-4" /> Applications
          </button>
          <Link
            href="/companyprofile"
            className="text-[#203947] px-4 py-2 font-medium flex items-center gap-1 hover:text-[#b30000] transition"
          >
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

        <div className="mb-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* العنوان والوصف */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="text-[#b30000] w-5 h-5" />
                <span className="text-[#b30000]">{jobTitle}</span>
                <span className="text-gray-700">Job Applications</span>
              </h2>
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

        {/**name of job */}

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
              {
                applications.filter(
                  (a) =>
                    (a.status?.toLowerCase() || "pending") ===
                    status.toLowerCase(),
                ).length
              }
              )
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        ) : filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onUpdateStatus={handleUpdateStatus}
              onViewProfile={setSelectedApplicant}
              setSelectedToReject={setSelectedToReject}
              setShowRejectModal={setShowRejectModal}
              job={job}
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
                  src={selectedApplicant.profileImage}
                  alt={
                    typeof selectedApplicant.name === "string"
                      ? selectedApplicant.name
                      : selectedApplicant.name?.value || "Applicant"
                  }
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                {typeof selectedApplicant.name === "string"
                  ? selectedApplicant.name
                  : selectedApplicant.name?.value || "Unknown"}
              </h2>
              <p className="mt-1 text-sm text-red-700 font-medium">
                {typeof selectedApplicant.role === "string"
                  ? selectedApplicant.role
                  : selectedApplicant.role?.value || "Role not specified"}
              </p>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide font-semibold">
                Status:{" "}
                <span className="capitalize">
                  {typeof selectedApplicant.status === "string"
                    ? selectedApplicant.status
                    : selectedApplicant.status?.value || "Unknown"}
                </span>
              </p>
              <p className="mt-6 text-center text-gray-700 text-sm leading-relaxed">
                {typeof selectedApplicant.bio === "string"
                  ? selectedApplicant.bio
                  : selectedApplicant.bio?.value || "No additional info."}
              </p>
              <Link
                href={`/profile/${selectedApplicant.id}`}
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
        <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Reject Applicant
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject{" "}
              <span className="font-medium text-[#b30000]">
                {typeof selectedToReject.name === "string"
                  ? selectedToReject.name
                  : selectedToReject.name?.value || "this applicant"}
              </span>
              ?
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
                  handleUpdateStatus(
                    selectedToReject.id,
                    "rejected",
                    selectedToReject.name || "The applicant",
                  );
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

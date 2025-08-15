"use client";

import {
  Star,
  MapPin,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  BadgeCheck,
  ListChecks,
  Clock,
  CheckCircle,
  Mail,
  Linkedin,
  Globe,
  MessageCircle,
  ClipboardCopy,
  Phone,
  FileText,
  ChevronDown,
  ChevronRight,
  Hand,
  ChevronLeft,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import toast, { Toaster } from "react-hot-toast";
import NavbarProfileCom from "./NavbarProfileCom";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import LogoClickable from "./LogoClickable";
import BackgroundClickable from "./BackgroundClickable";
import EditableProfileViewCom from "./EditableProfileViewCom";

function formatRelativeTime(date) {
  if (!date) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  if (diffHr < 24) return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

export default function ProfileViewCom() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const user = session?.user;

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [applicantImages, setApplicantImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // Fetch applicant images safely
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      if (!selectedJob?.applicants) return;
      const images = {};
      for (let applicant of selectedJob.applicants) {
        try {
          const userRef = doc(db, "users", applicant.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            images[applicant.userId] = userSnap.data().profileImage || "/default-user.png";
          } else {
            images[applicant.userId] = "/default-user.png";
          }
        } catch {
          images[applicant.userId] = "/default-user.png";
        }
      }
      if (isMounted) setApplicantImages(images);
    };
    loadImages();
    return () => { isMounted = false; };
  }, [selectedJob]);

  const {
    logo,
    name,
    location,
    rating,
    reviewsCount,
    description,
    services,
    technologies,
    website,
    email,
    linkedin,
    stats = {},
    industry,
    founded,
    phone,
    facebook,
  } = company || {};

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);


  async function fetchCompanyAndJobs() {
    if (!companyId) return;

    try {
      const companyRef = doc(db, "users", companyId);
      const companySnap = await getDoc(companyRef);
      const companyData = companySnap.exists() ? companySnap.data() : {};

      const jobsQuery = query(collection(db, "jobs"), where("companyId", "==", companyId));
      const jobsSnapshot = await getDocs(jobsQuery);

      const jobsData = jobsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      const activeProjects = jobsData.filter(
        (job) => job.status?.toLowerCase() === "active" || job.status?.toLowerCase() === "open"
      ).length;

      let totalApplicants = 0;
      let totalHired = 0;

      jobsData.forEach((job) => {
        if (!Array.isArray(job.applicants)) return;
        totalApplicants += job.applicants.length;
        totalHired += job.applicants.filter(
          (applicant) => applicant?.status?.toLowerCase() === "approved"
        ).length;
      });

      const successRate = totalApplicants > 0 ? `${Math.round((totalHired / totalApplicants) * 100)}%` : "0%";

      setCompany({ ...companyData, stats: { activeProjects, totalHired, successRate } });
      setJobs(jobsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company and jobs:", error);
      toast.error("Failed to load company data.");
    }
  }

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [companyId]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  async function handleApply() {
    if (!user?.id || !selectedJob) {
      toast.error("You must be logged in and select a job to apply.");
      return;
    }

    const hasAlreadyApplied = selectedJob?.applicants?.some(applicant =>
      typeof applicant === "string" ? applicant === user?.id : applicant?.userId === user?.id
    );

    if (hasAlreadyApplied) {
      toast.error("You have already applied to this job.");
      return;
    }

    try {
      const jobRef = doc(db, "jobs", selectedJob.id);
      await updateDoc(jobRef, {
        applicants: arrayUnion({ userId: user.id, status: "pending", appliedAt: new Date().toISOString() }),
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#333]">
      <Toaster position="top-right" />
      <NavbarProfileCom />

      {loading ? (
        <div className="max-w-6xl mx-auto space-y-4 p-4 animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-32 rounded-xl"></div>
              <div className="bg-gray-200 h-64 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
       <BackgroundClickable
  currentBackgroundUrl={company?.backgroundUrl || ""}
  onUploadSuccess={fetchCompanyAndJobs}
  className="relative w-full h-80 sm:h-96 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-lg"
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>

  {/* المحتوى */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-3">

    {/* Logo + زرار */}
    <div className="absolute flex flex-col items-center">
      <div className="w-32 h-42 rounded-full overflow-hidden absolute mb-270">
        <LogoClickable
          currentLogoUrl={company?.logo || "/default-logo.png"}
          onUploadSuccess={fetchCompanyAndJobs}
        />
      </div>

      
    </div>
    
    {/* اسم الشركة */}
    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words max-w-[90%]  ">
      {name || "Company Name"}
    </h1>

    {/* المعلومات */}
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-white/90 max-w-[90%] mb-20 ">
      {industry && <span className="bg-white/20 px-3 py-1 rounded-full">{industry}</span>}
      {founded && <span className="bg-white/20 px-3 py-1 rounded-full">Founded: {founded}</span>}
      {location && <span className="bg-white/20 px-3 py-1 rounded-full">{location}</span>}
      {phone && <span className="bg-white/20 px-3 py-1 rounded-full">{phone}</span>}
    </div>

  </div>
</BackgroundClickable>




          {/* Jobs + Stats + Editable Profile */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Jobs Column */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-2">
                Active Job Postings{" "}
                <span className="text-sm text-gray-500">
                  ({jobs.filter(job => job.status?.toLowerCase() === "active" || job.status?.toLowerCase() === "open").length} open positions)
                </span>
              </h2>
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="bg-white mt-20 rounded-xl p-8 text-center mr-20">
                    <h3 className="text-xl font-semibold text-[#333] mb-2">No Job Postings Yet</h3>
                    <p className="text-sm text-gray-700 max-w-md mx-auto mb-6">You haven’t posted any jobs yet. Start attracting top ITI talents by creating your first job posting now.</p>
                    <Link href="/PostJob" className="px-6 py-2 rounded-full bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white font-medium shadow hover:scale-105 transform transition">Post Your First Job</Link>
                  </div>
                ) : (
                  currentJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-500">Type: {job.type}</p>
                        <p className="text-sm text-gray-500">Level: {job.level}</p>
                        <p className="text-sm text-gray-500">Applications: {job.applicants?.length || 0}</p>
                        <button onClick={() => setSelectedJob(job)} className="mt-2 px-4 py-1 text-sm bg-[#b30000] text-white rounded hover:bg-[#8B0000] transition">View Details</button>
                      </div>
                      <div className="text-xs text-gray-400">{job.createdAt?.toDate && formatRelativeTime(job.createdAt.toDate())}</div>
                    </div>
                  ))
                )}

                {jobs.length > 0 && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel={<ChevronRight size={16} />}
                    previousLabel={<ChevronLeft size={16} />}
                    onPageChange={(e) => goToPage(e.selected + 1)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={totalPages}
                    forcePage={currentPage - 1}
                    containerClassName="flex items-center justify-center mt-6 gap-2 text-sm"
                    pageClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
                    activeClassName="bg-[#b30000] text-white border-[#b30000]"
                    previousClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
                    nextClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
                    breakClassName="px-2 py-1"
                  />
                )}
              </div>
            </div>

            {/* Stats + Editable Profile */}
            <div className="space-y-4">
              <div className="bg-white shadow rounded p-3">
                <h2 className="font-semibold mb-2 text-[#203947]">Company Statistics</h2>
                <ul className="text-sm mt-2 space-y-1 text-[#333]">
                  <li className="flex gap-2 items-center"><Briefcase className="w-4 h-4 text-[#b30000]" />{stats?.activeProjects ?? 0} Active Jobs</li>
                  <li className="flex gap-2 items-center"><Users className="w-4 h-4 text-[#b30000]" />{stats?.totalHired ?? 0}+ Total Hired</li>
                  <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-[#b30000]" />{stats?.successRate ?? 0} Success Rate</li>
                </ul>
              </div>
              <EditableProfileViewCom />
            </div>
          </div>


        

       {selectedJob && (
  <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh] space-y-6">
      
      {/* Job Title */}
      <h2 className="text-2xl font-bold mb-4 text-[#203947]">{selectedJob.title || "N/A"}</h2>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><Briefcase className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Type:</span> {selectedJob.type || "N/A"}</p>
        <p><BadgeCheck className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Level:</span> {selectedJob.level || "N/A"}</p>
        <p><DollarSign className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Salary:</span> {selectedJob.salary || "N/A"}</p>
        <p><MapPin className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Location:</span> {selectedJob.location || "N/A"}</p>
        <p><Calendar className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Deadline:</span> {selectedJob.deadline?.toDate ? selectedJob.deadline.toDate().toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Description */}
      {selectedJob.description && (
        <section className="space-y-2">
          <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
            <FileText className="w-4 h-4" /> Description
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.description}</p>
        </section>
      )}

      {/* Requirements */}
      {selectedJob.requirements && (
        <section className="space-y-2">
          <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Requirements
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.requirements}</p>
        </section>
      )}

      {/* Skills */}
      {selectedJob.skills && (
        <section className="space-y-2">
          <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
            <Star className="w-4 h-4" /> Skills Required
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedJob.skills?.split(",").map((skill, index) => (
              <span
                key={index}
                className="bg-[#203947] text-white px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      <section className="mt-6">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="text-md font-semibold text-[#8B0000] mb-3 flex items-center gap-2 focus:outline-none"
        >
          <MessageCircle className="w-5 h-5 text-[#8B0000]" />
          Comments
          {showComments ? (
            <ChevronDown className="w-4 h-4 text-[#203947]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#203947]" />
          )}
        </button>

        {showComments && (
          <>
            {selectedJob?.comments?.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {selectedJob.comments.map((comment, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm flex gap-4 items-start"
                  >
                    <img
                      src={applicantImages[comment.userId] || "/default-user.png"}
                      alt={comment.userName || "User"}
                      className="w-10 h-10 rounded-full object-cover mt-1 border"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-[#203947]">{comment.userName || "Unknown"}</p>
                        <p className="text-gray-400 text-xs">
                          {comment.timestamp?.seconds
                            ? formatRelativeTime(new Date(comment.timestamp.seconds * 1000))
                            : ""}
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text || ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </>
        )}
      </section>

      {/* Copy Job Link */}
      <button
        className="text-[#203947] flex items-center gap-2 text-sm hover:underline"
        onClick={() => {
          const link = `${window.location.origin}/jobs/${selectedJob.id}`;
          navigator.clipboard.writeText(link);
          toast.success("Job link copied to clipboard!");
        }}
      >
        <Hand className="w-4 h-4" />
        Copy Job Link
      </button>

      {/* Apply / Close */}
      <div className="flex justify-between items-center pt-4">
        {user?.role === "freelancer" ? (
          <button
            onClick={() => selectedJob && handleApply()}
            className="bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-[#a30000] text-sm transition-all"
          >
            Apply Now
          </button>
        ) : (
          <p className="text-sm text-gray-400 italic">Only freelancers can apply for jobs.</p>
        )}

        <button
          className="bg-[#203947] text-white px-4 py-2 rounded-md hover:bg-[#8B0000] text-sm transition-all"
          onClick={() => setSelectedJob(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}





        </>
      )}
    </main>
  );
}










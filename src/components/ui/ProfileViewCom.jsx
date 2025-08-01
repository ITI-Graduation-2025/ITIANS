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
  X,
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
} from "firebase/firestore";
import { db } from "@/config/firebase";
import toast from "react-hot-toast";
import { FaFacebook, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";
import NavbarProfileCom from "./NavbarProfileCom";





function formatRelativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}
const result = formatRelativeTime(new Date("2025-07-29"));

export default function ProfileViewCom() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  
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

  // حساب عرض الوظائف في الصفحة الحالية
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  function goToPage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function goNext() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  function goPrev() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  useEffect(() => {
    async function fetchCompanyAndJobs() {
      if (!companyId) return;

      const companyRef = doc(db, "users", companyId);
      const companySnap = await getDoc(companyRef);
      const companyData = companySnap.exists() ? companySnap.data() : {};

      const jobsQuery = query(
        collection(db, "jobs"),
        where("companyId", "==", companyId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = jobsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);

      
      const activeProjects = jobsData.filter(
        (job) =>
          job.status?.toLowerCase() === "active" ||
          job.status?.toLowerCase() === "open"
      ).length;
      const totalHired = jobsData.reduce((sum, job) => {
        if (!Array.isArray(job.applicants)) return sum;
        const hiredCount = job.applicants.filter(
          (applicant) => applicant.status === "shortlisted"
        ).length;
        return sum + hiredCount;
      }, 0);

      const closedJobs = jobsData.filter(
        (job) => job.status?.toLowerCase() === "closed"
      ).length;
      const successfulJobs = jobsData.filter(
        (job) =>
          Array.isArray(job.applicants) &&
          job.applicants.some((applicant) => applicant.status === "shortlisted")
      ).length;

      const totalJobs = jobsData.length;
      const successRate =
        totalJobs > 0 ? `${Math.round((successfulJobs / totalJobs) * 100)}%` : "N/A";

      setCompany({
        ...companyData,
        stats: {
          activeProjects,
          totalHired,
          successRate,
        },
      });

      setLoading(false);
    }

    fetchCompanyAndJobs();
  }, [companyId]);

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/jobs/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Job link copied to clipboard!");
  };

  return (
    
    <main className="min-h-screen bg-gray-50">
       <NavbarProfileCom />
      {/* Header */}
      <div
        className="text-white p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/business-people-working-office_23-2148902353.jpg')",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Image
              src={logo || "/default-logo.png"}
              alt={`${name || "Company"} Logo`}
              width={48}
              height={48}
              className="rounded-md shadow bg-white"
            />
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-sm text-gray-300">{description}</p>{" "}
              {/* الوصف */}
              <div className="flex flex-wrap gap-4 text-xs mt-1 text-gray-200">
                {industry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{industry}</span>
                  </div>
                )}
                {founded && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded: {founded}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1">
              <Star className="w-4 h-4 text-yellow-300" /> {rating}
            </p>
            <p className="text-sm">{reviewsCount} reviews</p>
            {session?.user?.id !== companyId && (
  <button className="mt-2 px-4 py-1 bg-white text-blue-700 rounded shadow">
    Follow Company
  </button>
)}

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Jobs List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">
            Active Job Postings{" "}
            <span className="text-sm text-gray-500">
              ({jobs.length} open positions)
            </span>
          </h2>
          <div className="space-y-4">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow rounded p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    <strong>Type:</strong> {job.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Level:</strong> {job.level}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Applications:</strong> {job.applicants?.length || 0}
                  </p>
                  <button
                    className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {job.createdAt?.toDate().toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => goToPage(num + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === num + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Company Statistics</h2>
            <ul className="text-sm mt-2 space-y-1">
              <li className="flex gap-2 items-center">
                <Briefcase className="w-4 h-4" /> {stats.activeProjects} Active Jobs
              </li>
              <li className="flex gap-2 items-center">
                <Users className="w-4 h-4" /> {stats.totalHired}+ Total Hired
              </li>
              <li className="flex gap-2 items-center">
                <CheckCircle className="w-4 h-4" /> {stats.successRate} Success Rate
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">About {name}</h2>
            <p className="text-sm mt-1">{description}</p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Core Services</h2>
            <ul className="text-sm mt-1 space-y-1 columns-2">
              {(services || []).map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold mb-2">Technologies We Use</h2>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {(technologies || []).map((tech) => (
                <div
                  key={tech}
                  className="px-2 py-1 bg-gray-100 rounded text-center"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded p-3">
  <h2 className="font-semibold">Contact Information</h2>
  <div className="text-sm mt-1 space-y-1">
    {website && (
      <p>
        <FaGlobe className="inline w-4 h-4 mr-1 text-blue-600" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {website}
        </a>
      </p>
    )}

    {email && (
      <p>
        <FaEnvelope className="inline w-4 h-4 mr-1 text-blue-600" />
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:underline"
        >
          {email}
        </a>
      </p>
    )}

    {linkedin && (
      <p>
        <FaLinkedin className="inline w-4 h-4 mr-1 text-blue-600" />
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {linkedin}
        </a>
      </p>
    )}

    {facebook && (
      <p>
        <FaFacebook className="inline w-4 h-4 mr-1 text-blue-600" />
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {facebook}
        </a>
      </p>
    )}
  </div>
</div>

        </div>
      </div>

      {/* Modal for Job Details & Comments */}
      {selectedJob && (
        <div className="fixed inset-0 z-50  bg-white/30 flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Job Title */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedJob.title}
            </h2>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p>
                <Briefcase className="inline w-4 h-4 mr-1" /> Type:{" "}
                {selectedJob.type}
              </p>
              <p>
                <BadgeCheck className="inline w-4 h-4 mr-1" /> Level:{" "}
                {selectedJob.level}
              </p>
              <p>
                <DollarSign className="inline w-4 h-4 mr-1" /> Salary:{" "}
                {selectedJob.salary}
              </p>
              <p>
                <MapPin className="inline w-4 h-4 mr-1" /> Location:{" "}
                {selectedJob.location}
              </p>
              <p>
                <Calendar className="inline w-4 h-4 mr-1" /> Deadline:{" "}
                {selectedJob.deadline?.toDate().toLocaleDateString()}
              </p>
              <p>
                <Eye className="inline w-4 h-4 mr-1" /> Views:{" "}
                {selectedJob.views || 0}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {selectedJob.description}
            </p>

            {/* Skills */}
            {selectedJob.skills && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Star className="w-4 h-4" /> Skills Required:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> Comments
              </h3>

              {selectedJob?.comments?.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto text-sm">
                  {selectedJob.comments.map((comment, index) => (
                    <li
                      key={index}
                      className="border p-3 rounded bg-gray-50 flex gap-3 items-start"
                    >
                      <img
                        src={comment.avatar || "/default-user.png"}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full object-cover mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.userName}
                        </p>
                        <p className="text-gray-600 text-xs mb-1">
                          {comment.timestamp?.seconds
                            ? new Date(
                                comment.timestamp.seconds * 1000
                              ).toLocaleString()
                            : ""}
                        </p>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Copy Job Link */}
            <button
              className="mt-6 text-blue-600 flex items-center gap-1 text-sm"
              onClick={() => handleCopyLink(selectedJob.id)}
            >
              <ClipboardCopy className="w-4 h-4" /> Copy Job Link
            </button>
          </div>
        </div>
      )}
    </main>
  );
}











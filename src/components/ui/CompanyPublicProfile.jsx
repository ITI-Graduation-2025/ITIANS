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
    Edit3,
     MoreVertical,
     Trash2,
} from "lucide-react";

import { FaFacebook, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, increment } from "firebase/firestore";

import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { use } from "react";


{/*formatRelativeTime  */}
function formatRelativeTime(date) {
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

export default function CompanyPublicProfile({ params }) {
    const { companyId } = use(params);
    const { data: session } = useSession();


    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [user, setUser] = useState(null);
    {/*apply job  */}
    const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);
    const [showActionsIndex, setShowActionsIndex] = useState(null);

    {/*comments  */}
   const [editingComment, setEditingComment] = useState(null);

const handleDeleteComment = (index) => {
  const updatedComments = [...selectedJob.comments];
  updatedComments.splice(index, 1);
  setSelectedJob({ ...selectedJob, comments: updatedComments });

  
};

const handleEditComment = (index) => {
  const commentToEdit = selectedJob.comments[index];
  setEditingComment({ index, text: commentToEdit.text });
};


{/*pageinate  */}
    const jobsPerPage = 3;

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
            });
        }
    }, [session]);


{/*apply job  */}
    useEffect(() => {
        if (!selectedJob || !user) {
            setHasAlreadyApplied(false);
            return;
        }

        const alreadyApplied = selectedJob.applicants?.some((applicant) => {
            if (typeof applicant === "string") {
                return applicant === user.id;
            }
            if (typeof applicant === "object" && applicant.userId) {
                return applicant.userId === user.id;
            }
            return false;
        });

        setHasAlreadyApplied(alreadyApplied);
    }, [selectedJob, user]);

{/*jobs */}
    useEffect(() => {
        async function fetchCompanyAndJobs() {
            if (!companyId) return;

            try {
                const companyRef = doc(db, "users", companyId);
                const companySnap = await getDoc(companyRef);
                const companyData = companySnap.exists() ? companySnap.data() : {};

                const jobsQuery = query(
                    collection(db, "jobs"),
                    where("companyId", "==", companyId)
                    
                );

                const jobsSnapshot = await getDocs(jobsQuery);

                const jobsData = jobsSnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); 

                // إحصائيات الوظائف
                const activeProjects = jobsData.filter(
                    (job) =>
                        job.status?.toLowerCase() === "active" ||
                        job.status?.toLowerCase() === "open"
                ).length;

                const totalHired = jobsData.reduce((sum, job) => {
                    if (!Array.isArray(job.applicants)) return sum;
                    const hiredCount = job.applicants.filter(
                        (applicant) => applicant.status === "Approved"
                    ).length;
                    return sum + hiredCount;
                }, 0);

                const successfulJobs = jobsData.filter(
                    (job) =>
                        Array.isArray(job.applicants) &&
                        job.applicants.some((applicant) => applicant.status === "Approved")
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

                setJobs(jobsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching company and jobs:", error);
                toast.error("Failed to load company data.");
            }
        }

        fetchCompanyAndJobs();
    }, [companyId]);


    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
{/*apply jobs  */}
    async function handleApply() {
        if (!user?.id) {
            toast.error("You must be logged in to apply.");
            return;
        }

        
        if (selectedJob?.deadline && new Date(selectedJob.deadline) < new Date()) {
            toast.error("The application deadline has passed.");
            return;
        }

        
        const isRejected = Array.isArray(selectedJob?.applicants) &&
            selectedJob.applicants.some((applicant) => {
                if (typeof applicant === "object" && applicant.userId === user.id) {
                    return applicant.status === "rejected";
                }
                return false;
            });

        if (isRejected) {
            toast.error("You have been rejected for this job and cannot re-apply.");
            return;
        }

        
        if (hasAlreadyApplied) {
            toast.error("You have already applied to this job.");
            return;
        }

        try {
            const jobRef = doc(db, "jobs", selectedJob.id);

            const newApplicant = {
                userId: user.id,
                status: "pending",
                appliedAt: new Date().toISOString(),
            };

            await updateDoc(jobRef, {
                applicants: arrayUnion(newApplicant),
                applicationsCount: increment(1),
            });

            // تحديث الحالة محليًا
            setSelectedJob((prev) => ({
                ...prev,
                applicants: [...(prev?.applicants || []), newApplicant],
                applicationsCount: (prev?.applicationsCount || 0) + 1,
            }));

            setHasAlreadyApplied(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error("Application error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    }

{/*loading  */}

    if (loading) return <p className="text-center py-8">جارٍ التحميل...</p>;
    if (!company) return <p className="text-center py-8">لم يتم العثور على الشركة.</p>;
    if (company.role !== "company") return <div className="text-center py-8">هذا الحساب ليس شركة</div>;

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

    return (
        <div className="min-h-screen bg-[#f9f9f9] text-[#333]">
            {/* Banner Section */}
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
                            <div className="flex flex-wrap gap-4 text-sm mt-2 text-[#333]">
                                {industry && (
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-gray-800">
                                        <Briefcase className="w-4 h-4 text-[#8B0000]" />
                                        <span>{industry}</span>
                                    </div>
                                )}
                                {founded && (
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-gray-800">
                                        <Calendar className="w-4 h-4 text-[#8B0000]" />
                                        <span>Founded: {founded}</span>
                                    </div>
                                )}
                                {location && (
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-gray-800">
                                        <MapPin className="w-4 h-4 text-[#8B0000]" />
                                        <span>{location}</span>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-gray-800">
                                        <Phone className="w-4 h-4 text-[#8B0000]" />
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
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {/* Left - Jobs List */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">
                        Active Job Postings{" "}
                        <span className="text-sm text-gray-500">
                            ({jobs.filter(job => job.status?.toLowerCase() === "active" || job.status?.toLowerCase() === "open").length} open positions)
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {currentJobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className="bg-white border border-gray-200 shadow-sm rounded p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{job.title}</h3>
                                    <p className="text-sm text-gray-500">Type: {job.type}</p>
                                    <p className="text-sm text-gray-500">Level: {job.level}</p>
                                    <p className="text-sm text-gray-500">Applications: {job.applicants?.length || 0}</p>

                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="mt-2 px-4 py-1 text-sm bg-[#b30000] text-white rounded hover:bg-[#8B0000] transition"
                                    >
                                        View Details
                                    </button>
                                </div>


                                <div className="text-xs text-gray-400">
                                    {job.createdAt?.toDate && formatRelativeTime(job.createdAt.toDate())}
                                </div>
                            </div>
                        ))}
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
                    </div>
                </div>

                {/* Right - Sidebar */}
                <div className="space-y-4">
                    {/* Stats */}
                    <div className="bg-white shadow rounded p-3">
                        <h2 className="font-semibold mb-2 text-[#203947]">Company Statistics</h2>
                        <ul className="text-sm mt-2 space-y-1 text-[#333]">
                            <li className="flex gap-2 items-center">
                                <Briefcase className="w-4 h-4 text-[#b30000]" />
                                {stats?.activeProjects ?? 0} Active Jobs
                            </li>
                            <li className="flex gap-2 items-center">
                                <Users className="w-4 h-4 text-[#b30000]" />
                                {stats?.totalHired ?? 0}+ Total Hired
                            </li>
                            <li className="flex gap-2 items-center">
                                <CheckCircle className="w-4 h-4 text-[#b30000]" />
                                {stats?.successRate ?? 0}% Success Rate
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className="bg-white shadow rounded p-3">
                        <h2 className="font-semibold mb-2 text-[#203947]">About {name}</h2>
                        <p className="text-sm text-[#333]">{description || "No description provided."}</p>
                    </div>

                    {/* Services */}
                    <div className="bg-white shadow rounded p-3">
                        <h2 className="font-semibold mb-2 text-[#203947]">Core Services</h2>
                        {services?.length > 0 ? (
                            <ul className="text-sm mt-1 space-y-1 columns-2 text-[#333]">
                                {services.map((service) => <li key={service}>{service}</li>)}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No core services listed.</p>
                        )}
                    </div>

                    {/* Technologies */}
                    <div className="bg-white shadow rounded p-3">
                        <h2 className="font-semibold mb-2 text-[#203947]">Technologies We Use</h2>
                        {technologies?.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 text-sm text-[#333]">
                                {technologies.map((tech) => (
                                    <div key={tech} className="px-2 py-1 bg-gray-100 rounded text-center">
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No technologies listed.</p>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="bg-white shadow rounded p-3">
                        <h2 className="font-semibold mb-2 text-[#203947]">Contact Information</h2>
                        <div className="text-sm mt-2 space-y-2 text-[#333]">
                            {website && (
                                <p>
                                    <FaGlobe className="inline w-4 h-4 mr-1 text-[#b30000]" />
                                    <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#203947]">{website}</a>
                                </p>
                            )}
                            {email && (
                                <p>
                                    <FaEnvelope className="inline w-4 h-4 mr-1 text-[#b30000]" />
                                    <a href={`mailto:${email}`} className="hover:underline text-[#203947]">{email}</a>
                                </p>
                            )}
                            {linkedin && (
                                <p>
                                    <FaLinkedin className="inline w-4 h-4 mr-1 text-[#b30000]" />
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#203947]">{linkedin}</a>
                                </p>
                            )}
                            {facebook && (
                                <p>
                                    <FaFacebook className="inline w-4 h-4 mr-1 text-[#b30000]" />
                                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#203947]">{facebook}</a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>


                {/* Job Details Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh] space-y-6">
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: "#fff",
                                        color: "#203947",
                                        border: "1px solid #ddd",
                                        padding: "12px 16px",
                                    },
                                }}
                            />

                            <h2 className="text-2xl font-bold mb-4 text-[#203947]">{selectedJob.title}</h2>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><Briefcase className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Type:</span> {selectedJob.type}</p>
                                <p><BadgeCheck className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Level:</span> {selectedJob.level}</p>
                                <p><DollarSign className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Salary:</span> {selectedJob.salary}</p>
                                <p><MapPin className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Location:</span> {selectedJob.location}</p>
                                <p><Calendar className="inline w-4 h-4 mr-1 text-[#8B0000]" /> <span className="text-[#8B0000] font-semibold">Deadline:</span> {selectedJob.deadline?.toDate().toLocaleDateString()}</p>
                            </div>

                            {selectedJob.description && (
                                <section className="space-y-2">
                                    <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Description
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.description}</p>
                                </section>
                            )}

                            {selectedJob.requirements && (
                                <section className="space-y-2">
                                    <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
                                        <ListChecks className="w-4 h-4" /> Requirements
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.requirements}</p>
                                </section>
                            )}

                            {selectedJob.skills && (
                                <section className="space-y-2">
                                    <h3 className="text-md font-semibold text-[#8B0000] flex items-center gap-2">
                                        <Star className="w-4 h-4" /> Skills Required
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills.split(",").map((skill, index) => (
                                            <span key={index} className="bg-[#203947] text-white px-3 py-1 rounded-full text-xs font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                               {/*Comments*/}
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
              className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm flex gap-4 items-start relative"
            >
              <img
                src={comment.avatar || "/default-user.png"}
                alt={comment.userName}
                className="w-10 h-10 rounded-full object-cover mt-1 border"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-[#203947]">
                    {comment.userName}
                  </p>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionsIndex(showActionsIndex === index ? null : index)
                      }
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {showActionsIndex === index && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border shadow-lg rounded-md z-10">
                        <button
                          onClick={() => {
                            handleEditComment(index);
                            setShowActionsIndex(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteComment(index);
                            setShowActionsIndex(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-xs">
                  {comment.timestamp?.seconds
                    ? formatRelativeTime(new Date(comment.timestamp.seconds * 1000))
                    : ""}
                </p>
                <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
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

                            <div className="flex justify-between items-center pt-4">
                                {user && (() => {
                                    const deadlinePassed =
                                        selectedJob.deadline && selectedJob.deadline.toDate() < new Date();

                                    const isRejected = Array.isArray(selectedJob?.applicants) &&
                                        selectedJob.applicants.some(
                                            (applicant) =>
                                                typeof applicant === "object" &&
                                                applicant.userId === user.id &&
                                                applicant.status?.toLowerCase() === "rejected"
                                        );


                                    if (deadlinePassed) {
                                        return <p className="text-red-500">Deadline has passed</p>;
                                    }

                                    return (

                                        <button
                                            onClick={hasAlreadyApplied || isRejected ? undefined : handleApply}
                                            disabled={hasAlreadyApplied || isRejected}
                                            className={`mt-4 px-4 py-2 rounded-md text-white text-sm transition-all ${hasAlreadyApplied || isRejected
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#8B0000] hover:bg-[#a30000]"
                                                }`}
                                        >
                                            {isRejected
                                                ||
                                                 hasAlreadyApplied
                                                    ? "Already Applied"
                                                    : "Apply Now"}
                                        </button>

                                    );
                                })()}

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
            </div>
        </div>
    );
}
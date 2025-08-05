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
  ChevronRight,
  ChevronLeft,
  Users2,
  Megaphone, 
  Plus,
  CalendarDays,
   Clock,
   AlertCircle,
    CheckCircle,  
    Ban,
    Briefcase,
     XCircle,
     DollarSign,
     MapPin,
     ClipboardList,
     ListChecks,
     UserCheck,
     FolderKanban,
     LayoutGrid,
     Newspaper,
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
  increment,
  getDoc,
  arrayRemove,
  serverTimestamp,
  
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "./JobForm";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";


function JobTabs({ stats }) {
  const tabs = [
    {
      label: "All Jobs",
      count: stats.all,
      icon: <Briefcase className="w-4 h-4 text-[#8B0000]" />,
      
    },
    {
      label: "Active",
      count: stats.active,
      icon: <PlayCircle className="w-4 h-4 text-green-600" />,
      
    },
    {
      label: "Paused",
      count: stats.paused,
      icon: <PauseCircle className="w-4 h-4 text-yellow-600" />,
    
    },
    {
      label: "Closed",
      count: stats.closed,
      icon: <XCircle className="w-4 h-4 text-red-600" />,
      
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium  shadow-sm`}
        >
          {tab.icon}
          {tab.label} ({tab.count})
        </div>
      ))}
    </div>
  );
}


export default function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const companyRef = companyId ? doc(db, "users", companyId) : null;
  const [currentPage, setCurrentPage] = useState(0);
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


  


  const clearNewApplications = async (jobId, userId) => {
  const jobRef = doc(db, "jobs", jobId);
  await updateDoc(jobRef, {
    newApplications: arrayRemove(userId),
  });
};



  {/**notification */}
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [lastNotifiedCount, setLastNotifiedCount] = useState(0);
 {/*paging */}
  const itemsPerPage = 6;
  const offset = currentPage * itemsPerPage;
  const currentJobs = jobs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(jobs.length / itemsPerPage);

 {/*notification new application */}
    useEffect(() => {
    if (!companyId) return;

    const unsubscribe = onSnapshot(collection(db, "jobs"), async (snapshot) => {
      const now = new Date();
      const jobsData = [];

      let newApps = 0;

      for (const docSnap of snapshot.docs) {
        const job = { id: docSnap.id, ...docSnap.data() };
        const deadlineDate = job.deadline?.seconds ? new Date(job.deadline.seconds * 1000) : null;

        if (job.companyId !== companyId) continue;

        if (job.status !== "Closed" && deadlineDate && deadlineDate < now) {
          await updateDoc(doc(db, "jobs", job.id), { status: "Closed" });
          job.status = "Closed";
        }

        if (job.status === "Closed" && deadlineDate && deadlineDate > now) {
          await updateDoc(doc(db, "jobs", job.id), { status: "Active" });
          job.status = "Active";
        }

        // Check if job has new applications
        if (job?.newApplications && job.newApplications.length > 0) {
          newApps += job.newApplications.length;
        }

        jobsData.push(job);
      }

      setJobs(
        jobsData.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        })
      );

      setNewApplicationsCount(newApps);

      if (companyRef) {
        const activeCount = jobsData.filter((j) => j.status === "Active").length;
        await updateDoc(companyRef, {
          "stats.activeJobs": activeCount,
        });
      }
    });

    return () => unsubscribe();
  }, [companyId]);
  {/*notification new application */ }

  useEffect(() => {
    if (newApplicationsCount > lastNotifiedCount) {
      toast.success(`You have ${newApplicationsCount} new application(s)`, {
        duration: 4000,
      });
      setLastNotifiedCount(newApplicationsCount);
    }
  }, [newApplicationsCount, lastNotifiedCount]);



  

  return (
    <div className="min-h-screen bg-[#f9f9f9]">{/**main bg color */}
      <Toaster position="bottom-right" />
      <CompanyNavbar />
        
      <main className="p-6 max-w-7xl mx-auto">
        <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
          {company?.name} <span className="text-[#203947] text-2xl">Dashboard</span>
        </h1>
       </div>

        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="px-4 py-2 flex items-center gap-1 text-[#203947] font-medium hover:text-[#b30000] transition">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="border-b-2 border-[#b30000] px-4 py-2 flex items-center gap-1 text-[#b30000] font-medium">
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
         <Link href="/AllCompanyApplicants" className="px-4 py-2 flex items-center font-medium gap-1 text-[#203947] hover:text-[#b30000]">
            <Users2 className="w-4 h-4" /> Applications
          </Link>

          <Link href="/companyprofile" className="text-[#203947] px-4 py-2 font-medium flex items-center gap-1 hover:text-[#b30000] transition">
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>
           {/**job heading */}
        {jobs.length > 0 && (
          <div className="flex justify-between items-center mb-4 border-b border-gray-300">
  <div className="mb-6">
    <div className="flex items-center gap-2">
      <Newspaper className="text-[#b30000] w-5 h-5" />
      <h2 className="text-xl font-semibold text-[#203947]">Your Job Postings</h2>
    </div>
    <p className="text-sm text-gray-800 mt-1">
      Overview of all your job postings with current status.
    </p>
  </div>

            <Link href="/PostJob">
              <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b30000] to-[#8B0000] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Post New Job
                </span>
              </button>
            </Link>
          </div>
        )}

        <JobTabs
  stats={{
    all: jobs.length,
    active: jobs.filter((j) => j.status === "Active").length,
    paused: jobs.filter((j) => j.status === "Paused").length,
    closed: jobs.filter((j) => j.status === "Closed").length,
  }}
/>


        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                companyRef={companyRef}
                onEdit={() => setEditJob(job)}
                newApplications={job.newApplications || []}
                 clearNewApplications={clearNewApplications}

              />
            ))
          ) : (
              <div className="bg-white rounded-xl p-10 text-center col-span-full">
                {/* العنوان مع الأيقونة */}
                <div className="flex justify-center items-center gap-2 mb-4 text-[#8B0000]">
                  <Megaphone className="w-6 h-6" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    No Job Postings
                  </h2>
                </div>

                {/* الوصف */}
                <p className="text-base text-gray-600 font-normal leading-relaxed mb-6 max-w-xl mx-auto">
                  You haven't posted any jobs yet. Start attracting top ITI talents by posting your first job now.
                </p>

                {/* الزر */}
                <Link href="/PostJob">
                  <button className="group inline-flex items-center gap-2 bg-gradient-to-br from-[#b30000] to-[#8B0000] hover:from-[#a00000] hover:to-[#750000] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]">
                    <Plus className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90" />
                    <span className="text-sm">Post Your First Job</span>
                  </button>
                </Link>
              </div>

          )}
        </div>
      </main>

      <ReactPaginate
  breakLabel="..."
  nextLabel={<ChevronRight size={16} />}
  previousLabel={<ChevronLeft size={16} />}
  onPageChange={({ selected }) => setCurrentPage(selected)}
  pageRangeDisplayed={3}
  marginPagesDisplayed={1}
  pageCount={pageCount}
  forcePage={currentPage} // لو عندك تحكم بالصفحة الحالية
  containerClassName="flex items-center justify-center mt-6 gap-2 text-sm"
  pageClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
  activeClassName="bg-[#b30000] text-white border-[#b30000]"
  previousClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
  nextClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-[#f5f5f5]"
  breakClassName="px-2 py-1"
/>



      {editJob && (
        <JobForm mode="edit" job={editJob} onClose={() => setEditJob(null)} />
      )}
    </div>
  );
}


function formatTimestamp(ts) {
  if (!ts || !ts.seconds) return "-";
  return new Date(ts.seconds * 1000).toLocaleDateString();
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
  newApplications = [],
   clearNewApplications, 
}) {
  const [showConfirm, setShowConfirm] = useState(false);

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
      await updateDoc(companyRef, {
        "stats.activeJobs": increment(-1),
      });
      toast.success("Job paused successfully");
    } catch {
      toast.error("Error pausing job");
    }
  };

  const handleResume = async () => {
    try {
      await updateDoc(doc(db, "jobs", id), { status: "Active" });
      await addActivity({ type: "status", text: `Resumed job: ${title}`, detail: "" });
      await updateDoc(companyRef, {
        "stats.activeJobs": increment(1),
      });
      toast.success("Job resumed successfully");
    } catch {
      toast.error("Error resuming job");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      await addActivity({ type: "delete", text: `Deleted job: ${title}`, detail: "" });

      if (status === "Active") {
        await updateDoc(companyRef, {
          "stats.activeJobs": increment(-1),
        });
      }

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
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-3 flex-wrap">
  <span className="flex items-center gap-1">
    <MapPin className="w-4 h-4 text-[#8B0000]" />
    {location}
  </span>
  <span className="flex items-center gap-1">
    <Briefcase className="w-4 h-4 text-[#8B0000]" />
    {type}
  </span>
  <span className="flex items-center gap-1">
    <DollarSign className="w-4 h-4 text-[#8B0000]" />
    {salary}
  </span>
</p>

        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Paused"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs flex-nowrap overflow-hidden">
  <div className="flex items-center gap-1 px-1 py-0.5 rounded text-blue-800 whitespace-nowrap">
    <Users2 className="w-4 h-4 text-blue-600" />
    {applicationsCount || 0} Applications
  </div>

  {newApplications.length > 0 && (
    <div className="bg-red-600 text-white px-1 py-0.5 rounded animate-pulse whitespace-nowrap">
      {newApplications.length} New
    </div>
  )}

  <div className="flex items-center gap-1 px-1 py-0.5 whitespace-nowrap">
    <CalendarDays className="w-4 h-4 text-yellow-600" />
    Posted: {formatTimestamp(postedAt)}
  </div>

  <div className="flex items-center gap-1 px-1 py-0.5 whitespace-nowrap">
    <Clock className="w-4 h-4 text-red-600" />
    Deadline: {formatTimestamp(deadline)}
  </div>
</div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Link
          href={`/Applicationjob/${id}`}
          onClick={() => {
            newApplications.forEach((uid) => {
              clearNewApplications(id, uid);
            });
          }}
>
  <button className="bg-[#b30000] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
    View Applications
  </button>
</Link>



        {status === "Active" && (
          <button onClick={handlePause} className=" text-yellow-700 px-2 py-1 rounded text-xs flex items-center gap-1">
            <PauseCircle size={12} /> Pause
          </button>
        )}

        {status === "Paused" && (
          <button onClick={handleResume} className=" text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1">
            <PlayCircle size={12} /> Resume
          </button>
        )}

        <button onClick={onEdit} className=" text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1">
          <Edit size={12} /> Edit
        </button>

        <button onClick={() => setShowConfirm(true)} className=" text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1">
          <Trash2 size={12} /> Delete
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center animate-fade-in">
          <div className="bg-white/30 backdrop-blur-md border border-white/20 p-4 rounded shadow w-64 transition">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this job?
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleDelete();
                  setShowConfirm(false);
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-3 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




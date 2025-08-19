"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import CompanyNavbar from "./CompanyNavbar";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  LayoutDashboard,
  FileText,
  Building2,
  FilePlus,
  Eye,
  Star,
  ArrowUpRight,
  ArrowRight,
  ClipboardCopy,
  Zap,
  Clock,
  Users2,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graduates, setGraduates] = useState([]);
  const [freelancersCount, setFreelancersCount] = useState(null);
  const [totalPending, setTotalPending] = useState(0);
  const [successRate, setSuccessRate] = useState(null);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    hires: 0,
    newThisWeek: 0,
    hiresThisMonth: 0,
    applicationTrend: null,
    hireTrend: null,
  });
  const [applicationsByJob, setApplicationsByJob] = useState({});

  const pathname = usePathname();
  const isActive = (route) => pathname === route;

  // Fetch company stats (Live)
  useEffect(() => {
    if (!companyId) return;
    const companyRef = doc(db, "users", companyId);
    const unsubscribe = onSnapshot(companyRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompanyStats(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [companyId]);

  // Fetch freelancers count (Static fetch once)
  useEffect(() => {
    const fetchFreelancers = async () => {
      if (!companyId) return;

      try {
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, where("companyId", "==", companyId));
        const querySnapshot = await getDocs(q);

        let totalApproved = 0;

        querySnapshot.forEach((docSnap) => {
          const job = docSnap.data();
          console.log("Job:", job.title, job.applicants);

          const applicants = Array.isArray(job.applicants)
            ? job.applicants
            : [];

          applicants.forEach((applicant) => {
            console.log("Applicant:", applicant);

            if (
              applicant &&
              typeof applicant === "object" &&
              applicant.status &&
              applicant.userId
            ) {
              if (applicant.status.toLowerCase() === "approved") {
                totalApproved++;
              }
            }
          });
        });

        console.log("Total Approved Freelancers:", totalApproved);
        setFreelancersCount(totalApproved);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
      }
    };

    fetchFreelancers();
  }, [companyId]);

  // Fetch pending freelancers  (Static fetch once)
  useEffect(() => {
    const fetchPendingApplications = async () => {
      if (!companyId) return;

      try {
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, where("companyId", "==", companyId));
        const querySnapshot = await getDocs(q);

        let totalPending = 0;

        querySnapshot.forEach((docSnap) => {
          const job = docSnap.data();
          const applicants = Array.isArray(job.applicants)
            ? job.applicants
            : [];

          applicants.forEach((applicant) => {
            if (
              applicant &&
              typeof applicant === "object" &&
              applicant.status &&
              applicant.userId
            ) {
              if (applicant.status.toLowerCase() === "pending") {
                totalPending++;
              }
            }
          });
        });

        setTotalPending(totalPending);
      } catch (err) {
        console.error("Error fetching pending applications:", err);
      }
    };

    fetchPendingApplications();
  }, [companyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRef = collection(db, "jobs");
        const jobsQuery = query(jobsRef, where("companyId", "==", companyId));
        const jobsSnap = await getDocs(jobsQuery);
        const totalJobs = jobsSnap.size;

        let jobsWithApproved = 0;

        jobsSnap.forEach((jobDoc) => {
          const jobData = jobDoc.data();
          if (jobData.applicants && jobData.applicants.length > 0) {
            const approved = jobData.applicants.some(
              (app) => app.status === "approved",
            );
            if (approved) {
              jobsWithApproved++;
            }
          }
        });

        const rate = totalJobs > 0 ? (jobsWithApproved / totalJobs) * 100 : 0;
        setSuccessRate(rate.toFixed(1));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [companyId]);

  const handleStartChat = async (gradId) => {
    if (!session?.user?.id) return;

    try {
      const chatId = [session.user.id, gradId].sort().join("_"); // simple generateChatId
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [session.user.id, gradId],
          createdAt: serverTimestamp(),
          lastMessage: "",
        });
      }

      window.location.href = `/chat/${chatId}`;
    } catch (err) {
      console.error(err);
      toast.error("Failed to start chat");
    }
  };

  // Fetch applications stats and jobs (Live)
  useEffect(() => {
    if (!companyId) return;

    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("companyId", "==", companyId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let total = 0;
      let hires = 0;
      let newApplicationsThisWeek = 0;
      let lastWeekApplications = 0;
      let hiresThisMonth = 0;
      let hiresLastMonth = 0;

      const jobCounts = {};

      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      querySnapshot.forEach((doc) => {
        const job = doc.data();
        const applicants = job.applicants || [];
        const title = job.title || "Untitled Job";

        jobCounts[title] = applicants.length;

        applicants.forEach((applicant) => {
          if (typeof applicant === "string") {
            total += 1;
          } else if (typeof applicant === "object" && applicant.userId) {
            total += 1;

            const appliedDate = applicant.appliedAt
              ? new Date(applicant.appliedAt)
              : job.createdAt?.toDate
                ? job.createdAt.toDate()
                : null;

            if (appliedDate) {
              if (appliedDate >= oneWeekAgo) {
                newApplicationsThisWeek += 1;
              } else if (
                appliedDate >= twoWeeksAgo &&
                appliedDate < oneWeekAgo
              ) {
                lastWeekApplications += 1;
              }
            }

            if (applicant.status?.toLowerCase() === "approved") {
              hires += 1;

              if (appliedDate) {
                if (appliedDate >= startOfThisMonth) {
                  hiresThisMonth += 1;
                } else if (
                  appliedDate >= startOfLastMonth &&
                  appliedDate <= endOfLastMonth
                ) {
                  hiresLastMonth += 1;
                }
              }
            }
          }
        });
      });

      const getTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? "up" : "flat";
        if (current > previous) return "up";
        if (current < previous) return "down";
        return "flat";
      };

      setApplicationStats({
        total,
        hires,
        newThisWeek: newApplicationsThisWeek,
        hiresThisMonth,
        applicationTrend: getTrend(
          newApplicationsThisWeek,
          lastWeekApplications,
        ),
        hireTrend: getTrend(hiresThisMonth, hiresLastMonth),
      });

      setApplicationsByJob(jobCounts);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  // Fetch approved freelancers (graduates)
  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, "jobs"),
      where("companyId", "==", companyId),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const applicantsMap = new Map();

        snapshot.forEach((docSnap) => {
          const job = docSnap.data() || {};
          const applicants = Array.isArray(job.applicants)
            ? job.applicants
            : [];

          applicants.forEach((a) => {
            const userId = typeof a === "string" ? a : a?.userId;
            if (!userId) return;

            const applicantStatus =
              typeof a === "object"
                ? (a.status || a.state || "").toLowerCase()
                : "";

            if (applicantStatus === "approved") {
              if (!applicantsMap.has(userId)) {
                applicantsMap.set(userId, {
                  userId,
                  jobs: [],
                  completedJobs: [],
                  applicantInfo: a,
                });
              }
              applicantsMap.get(userId).jobs.push(job.title || "N/A");
            }

            if (applicantStatus === "completed") {
              if (!applicantsMap.has(userId)) {
                applicantsMap.set(userId, {
                  userId,
                  jobs: [],
                  completedJobs: [job.title || "N/A"],
                  applicantInfo: a,
                });
              } else {
                applicantsMap
                  .get(userId)
                  .completedJobs.push(job.title || "N/A");
              }
            }
          });
        });

        //
        const approvedOnly = Array.from(applicantsMap.values()).filter(
          (p) => p.jobs.length > 0,
        );

        const rows = await Promise.all(
          approvedOnly.map(async (p) => {
            const userSnap = await getDoc(doc(db, "users", p.userId));
            const u = userSnap.exists() ? userSnap.data() : {};

            return {
              id: p.userId,
              name: u.name || "Unknown",
              role: u.jobTitle || u.role || "N/A",
              specialization: u.mainTrack || u.specialization || "",
              currentProjects: p.jobs,
              completedCount: p.completedJobs.length,
              status: "Active",
              photo: u.profileImage || u.photoURL || "/default-avatar.png",
              profileLink: `/profile/${p.userId}`,
              chatLink: `/chat/${p.userId}`,
            };
          }),
        );

        setGraduates(rows);
      } catch (err) {
        console.error("Failed to load approved graduates:", err);
        setGraduates([]);
      }
    });

    return () => unsubscribe();
  }, [companyId]);

  // const recentActivities =
  //   companyStats?.recentActivities
  //     ?.filter((activity) => activity?.text && activity?.type)
  //     ?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <CompanyNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold ">
          Welcome, <span className="text-[#203947]">{companyStats?.name}</span>
        </h1>

        <p className="text-gray-600 mb-6">
          Here’s your company dashboard — review insights, manage jobs, and
          connect with itiains.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Freelancers"
            value={
              freelancersCount !== null
                ? freelancersCount.toLocaleString()
                : "—"
            }
            icon={Users2}
            iconColor="bg-orange-500"
          />

          <StatCard
            title="Active Jobs"
            value={companyStats?.stats?.activeJobs}
            detail="Live now"
          />
          <StatCard
            title="Total Applications"
            value={applicationStats.total}
            detail={`+${applicationStats.newThisWeek} this week`}
            trend={applicationStats.applicationTrend}
            tooltip="Total number of applications received"
          />
          <StatCard
            title="Pending Applications"
            value={totalPending}
            icon={FileText}
            color="bg-yellow-400"
          />

          <StatCard
            title="Successful Hires"
            value={applicationStats.hires}
            detail={`+${applicationStats.hiresThisMonth} this month`}
            trend={applicationStats.hireTrend}
          />

          <StatCard
            title="Success Rate"
            value={successRate + "%"}
            icon={Trophy}
          />
        </div>

        {/* Recent Activity + Graduates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-start">
          {/* Applications by Job */}
          <section className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Applications by Job
            </h2>
            {Object.keys(applicationsByJob).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(applicationsByJob).map(([title, count]) => {
                  const percentage = Math.min(
                    (count / applicationStats.total) * 100,
                    100,
                  );
                  return (
                    <div key={title} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {title}
                        </span>
                        <span className="text-gray-500">
                          {count} applications
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No applications yet.</p>
            )}
          </section>

          {/* ITI Graduates Section */}
          <section className="bg-white shadow rounded-lg p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                ITI Graduates Hired
              </h2>
              <span className="text-sm text-gray-500">
                {graduates.length} total hired
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {graduates.map((grad) => (
                <div
                  key={grad.id}
                  className="flex items-start gap-3 border-b pb-4"
                >
                  <Image
                    src={grad.photo}
                    alt={grad.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {grad.name}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          grad.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {grad.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{grad.role}</p>
                    <p className="text-xs text-gray-400">
                      {grad.specialization}
                    </p>
                    <p className="text-sm mt-1">
                      Current:{" "}
                      <span className="text-gray-700">
                        {grad.currentProjects?.length
                          ? grad.currentProjects.join(", ")
                          : "No current projects"}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {grad.completedProjects?.length || 0} completed
                      </span>
                    </div>
                    <div className="mt-2 flex gap-4">
                      <Link
                        href={
                          grad.profileLink || `/profile/${grad.id || grad.uid}`
                        }
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => handleStartChat(grad.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {grad.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Activity Section
<section className="bg-white shadow p-4 rounded mb-6 max-w-xl mr-auto">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <Clock className="text-red-600 w-5 h-5" />
    Recent Activity
  </h2>
  {recentActivities.length > 0 ? (
    <ul className="space-y-2 text-sm text-gray-700">
      {recentActivities.map((activity, idx) => (
        <Activity
          key={idx}
          icon={getActivityIcon(activity.type)}
          text={activity.text}
          detail={activity.detail}
        />
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No activity yet.</p>
  )}
</section> */}
      </main>
    </div>
  );
}
function StatCard({ title, value, detail, trend, tooltip }) {
  return (
    <div
      className="bg-white rounded-lg shadow p-4 w-full flex flex-col items-center justify-center text-center"
      title={tooltip || ""}
    >
      <div className="text-sm font-bold text-gray-900">{title}</div>
      <div className="text-2xl text-gray-800 font-medium mt-1">
        {value ?? "N/A"}
      </div>
      {detail && (
        <div className="flex items-center text-sm mt-2">
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowRight className="w-4 h-4 text-gray-400 mr-1" />
          )}
          <span
            className={`${trend === "up" ? "text-green-600" : "text-gray-500"}`}
          >
            {detail}
          </span>
        </div>
      )}
    </div>
  );
}

function Activity({ icon, text, detail }) {
  return (
    <li className="flex items-center gap-2">
      {icon}
      <span className="font-medium">{text}</span>
      {detail && <span className="text-gray-500 text-xs"> – {detail}</span>}
    </li>
  );
}

function getActivityIcon(type) {
  switch (type) {
    case "application":
      return <FilePlus className="text-green-600 w-4 h-4" />;
    case "view":
      return <Eye className="text-blue-600 w-4 h-4" />;
    case "rating":
      return <Star className="text-yellow-600 w-4 h-4" />;
    case "job_posted":
      return <FilePlus className="text-red-600 w-4 h-4" />;
    default:
      return <FileText className="text-gray-400 w-4 h-4" />;
  }
}

function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow p-4 rounded">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          ))}
        </div>
        <div className="bg-white shadow p-4 rounded">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

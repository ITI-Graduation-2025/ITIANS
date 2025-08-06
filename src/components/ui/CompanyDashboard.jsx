"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, onSnapshot, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import CompanyNavbar from "./CompanyNavbar";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const companyId = session?.user?.id;
  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    hires: 0,
    newThisWeek: 0,
    hiresThisMonth: 0,
    applicationTrend: null,
    hireTrend: null,
  });

  const pathname = usePathname();
  const isActive = (route) => pathname === route;

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

 useEffect(() => {
  if (!companyId) return;

  const fetchApplications = async () => {
    try {
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef, where("companyId", "==", companyId));
      const querySnapshot = await getDocs(q);

      let total = 0;
      let hires = 0;
      let newApplicationsThisWeek = 0;
      let lastWeekApplications = 0;
      let hiresThisMonth = 0;
      let hiresLastMonth = 0;

      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      querySnapshot.forEach((doc) => {
        const job = doc.data();
        const applicants = job.applicants || [];

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
              } else if (appliedDate >= twoWeeksAgo && appliedDate < oneWeekAgo) {
                lastWeekApplications += 1;
              }
            }

            if (applicant.status?.toLowerCase() === "approved") {
              hires += 1;

              if (appliedDate) {
                if (appliedDate >= startOfThisMonth) {
                  hiresThisMonth += 1;
                } else if (appliedDate >= startOfLastMonth && appliedDate <= endOfLastMonth) {
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

      const applicationTrend = getTrend(newApplicationsThisWeek, lastWeekApplications);
      const hireTrend = getTrend(hiresThisMonth, hiresLastMonth);

      setApplicationStats({
        total,
        hires,
        newThisWeek: newApplicationsThisWeek,
        hiresThisMonth,
        applicationTrend,
        hireTrend,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error calculating application stats:", error);
      setLoading(false);
    }
  };

  fetchApplications();
}, [companyId]);

  if (status === "loading" || loading)
    return <DashboardSkeleton />;

  if (!companyId)
    return <div className="p-6 text-red-500">Please log in to view your dashboard.</div>;

  const recentActivities =
    companyStats?.recentActivities?.filter((activity) => activity?.text && activity?.type)?.slice(0, 5) || [];

  const navTabs = [
    { label: "Overview", href: "/dashboardCompany", icon: LayoutDashboard },
    { label: "My Jobs", href: "/companyjobs", icon: FileText },
    { label: "Applications", href: "/AllCompanyApplicants", icon: Users2 },
    { label: "CompanyProfile", href: "/companyprofile", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <CompanyNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
          {companyStats?.name} <span className="text-[#203947] text-2xl">Dashboard</span>
        </h1>

        <p className="text-gray-600 mb-6">Manage your job postings and find the best ITI talent</p>

        {/* Tabs */}
        <nav className="flex gap-4 border-b mb-6 overflow-x-auto whitespace-nowrap">
          {navTabs.map(({ label, href, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2 flex items-center gap-1 font-medium ${isActive(href)
                  ? "text-[#b30000] border-b-2 border-[#b30000]"
                  : "text-[#203947] hover:text-[#b30000]"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {badge && (
                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
                  +{badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            title="Successful Hires"
            value={applicationStats.hires}
            detail={`+${applicationStats.hiresThisMonth} this month`}
            trend={applicationStats.hireTrend}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
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
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center">
  {/* العنوان */}
  <div className="flex items-center gap-2 mb-6">
    <Zap className="text-red-600 w-6 h-6" />
    <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
  </div>

  {/* الأزرار */}
 <div className="flex flex-col gap-4 w-full">
  {/* زر أساسي بتدرج */}
  <Link href="/PostJob" className="w-full">
    <button 
      className="w-full flex items-center justify-center gap-3 px-6 py-4 
                 rounded-xl font-semibold text-white text-base
                 bg-gradient-to-r from-[#b30000] to-[#8B0000] 
                 hover:shadow-lg hover:scale-[1.02] active:scale-95
                 transition-all duration-300 relative overflow-hidden group">
      <FilePlus className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
      Post New Job
    </button>
  </Link>

  {/* زر ثانوي (Outline + خلفية فاتحة) */}
  <Link href="/AllCompanyApplicants" className="w-full">
    <button 
      className="w-full flex items-center justify-center gap-3 px-6 py-4 
                 rounded-xl font-semibold text-[#b30000] text-base 
                 border-2 border-[#b30000] bg-white
                 hover:bg-[#f5f5f5] hover:shadow-md hover:scale-[1.02] active:scale-95
                 transition-all duration-300 relative overflow-hidden group">
      <ClipboardCopy className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
      View Applicants
    </button>
  </Link>
</div>

</div>

        </div>
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
      <div className="text-2xl text-[#b30000] font-medium mt-1">{value ?? "N/A"}</div>
      {detail && (
        <div className="flex items-center text-sm mt-2">
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowRight className="w-4 h-4 text-gray-400 mr-1" />
          )}
          <span className={`${trend === "up" ? "text-green-600" : "text-gray-500"}`}>
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

/* --- Skeleton Component --- */
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



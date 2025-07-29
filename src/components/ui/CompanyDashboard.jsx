"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import CompanyNavbar from "./CompanyNavbar";
import {
  LayoutDashboard,
  FileText,
  Building2,
  FilePlus,
  Mail,
  Eye,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [companyStats, setCompanyStats] = useState(null);
  const loading = status === "loading";
  const user = session?.user;

  useEffect(() => {
    if (!user?.id) return;

    const companyRef = doc(db, "users", user.id);

    const unsubscribe = onSnapshot(
      companyRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCompanyStats(docSnap.data());
        }
      },
      (error) => {
        console.error("Error fetching company data:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">Please log in to view your dashboard.</div>;

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <CompanyNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Company Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your job postings and find the best ITI talent</p>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="border-b-2 border-red-500 px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600">
            <LayoutDashboard className="w-4 h-4" /> My Jobs
          </Link>
          <Link href="/Applicationjob" className="text-gray-600 hover:text-red-600 px-4 py-2 flex items-center gap-1">
            <FileText className="w-4 h-4" /> Applications
          </Link>
          <Link href="/companyprofile" className="text-gray-600 px-4 py-2 font-medium flex items-center gap-1">
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Jobs"
            value={companyStats?.stats?.activeJobs}
            detail="Live now"
          />
          <StatCard
            title="Total Applications"
            value={companyStats?.totalApplications}
            detail="+45 this week"
          />
          <StatCard
            title="Profile Views"
            value={companyStats?.profileViews}
            detail="+12% this month"
          />
          <StatCard
            title="Successful Hires"
            value={companyStats?.successfulHires}
            detail="+8 this month"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {companyStats?.recentActivities?.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {companyStats.recentActivities.map((activity, idx) => (
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

          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/PostJob">
                <button className="flex justify-center items-center gap-2 border rounded px-4 py-2 text-red-600 border-red-300 hover:bg-red-50">
                  <FilePlus className="w-4 h-4" /> Post New Job
                </button>
              </Link>
              <button className="flex justify-center items-center gap-2 border rounded px-4 py-2 text-red-600 border-red-300 hover:bg-red-50">
                <Mail className="w-4 h-4" /> Messages
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, detail }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <div className="text-gray-600 mb-2">{title}</div>
      <div className="text-2xl font-bold">{value ?? "N/A"}</div>
      <div className="text-gray-500 text-sm">{value ? detail : "No data yet"}</div>
    </div>
  );
}

function Activity({ icon, text, detail }) {
  return (
    <li className="flex items-center gap-2">
      {icon}
      <span className="font-medium">{text}</span>
      {detail}
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

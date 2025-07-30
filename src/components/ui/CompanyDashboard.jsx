"use client";

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


export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-[#fff7f2]">
      {/* Navbar */}
      <CompanyNavbar />

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Company Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
         <Link
            href="/dashboard"
            className=" border-b-2 border-red-500 px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600"
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link
       href="/companyjobs"
      className="px-4 py-2 flex items-center gap-1  text-gray-600 font-medium hover:text-red-600"
      >
       <LayoutDashboard className="w-4 h-4" /> My Jobs
       </Link>
          <Link
  href="/Applicationjob"
  className="text-gray-600 hover:text-red-600 px-4 py-2 flex items-center gap-1"
>
  <FileText className="w-4 h-4" /> Applications
</Link>
         <Link
    href="/companyprofile"
    className=" text-gray-600 px-4 py-2 font-medium flex items-center gap-1"
  >
    <Building2 className="w-4 h-4" /> Company Profile
  </Link>
</div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded">
            <div className="text-gray-600 mb-2">Active Jobs</div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-green-600 text-sm">+3 this month</div>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <div className="text-gray-600 mb-2">Total Applications</div>
            <div className="text-2xl font-bold">247</div>
            <div className="text-green-600 text-sm">+45 this week</div>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <div className="text-gray-600 mb-2">Profile Views</div>
            <div className="text-2xl font-bold">1,842</div>
            <div className="text-green-600 text-sm">+12% this month</div>
          </div>
          <div className="bg-white shadow p-4 rounded">
            <div className="text-gray-600 mb-2">Successful Hires</div>
            <div className="text-2xl font-bold">28</div>
            <div className="text-green-600 text-sm">+8 this month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FilePlus className="text-green-600 w-4 h-4" />
                <span className="font-medium">New application received</span>
                - Electrical Technician position - 2 hours ago
              </li>
              <li className="flex items-center gap-2">
                <Eye className="text-blue-600 w-4 h-4" />
                <span className="font-medium">Job post viewed 45 times</span>
                - Mechanical Engineer position - 5 hours ago
              </li>
              <li className="flex items-center gap-2">
                <Star className="text-yellow-600 w-4 h-4" />
                <span className="font-medium">Profile rating updated</span>
                - Company rating: 4.8/5 - 1 day ago
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
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

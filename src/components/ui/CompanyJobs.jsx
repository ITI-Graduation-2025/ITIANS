"use client";

import CompanyNavbar from "./CompanyNavbar";
import {
  LayoutDashboard,
  FileText,
  Building2,
  
} from "lucide-react";
import Link from "next/link";

export default function CompanyJobs() {
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
            className="px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600"
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className=" border-b-2 border-red-500 px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <FileText className="w-4 h-4" /> My Jobs
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

        {/* Jobs header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Job Postings</h2>
          <Link href="/PostJob">
  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm shadow hover:bg-red-700 transition">
    + Post New Job
  </button>
</Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
            All Jobs (5)
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
            Active (3)
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">
            Paused (1)
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            Closed (1)
          </span>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobCard
            title="Senior Electrical Technician"
            location="Mumbai, Maharashtra"
            type="Full Time"
            salary="₹25k - ₹35k"
            status="Active"
            applications="34"
            views="245"
            posted="1/15/2024"
            deadline="2/15/2024"
          />
          <JobCard
            title="Mechanical Engineer"
            location="Pune, Maharashtra"
            type="Full Time"
            salary="₹30k - ₹40k"
            status="Active"
            applications="28"
            views="189"
            posted="1/12/2024"
            deadline="2/12/2024"
          />
        </div>
      </main>
    </div>
  );
}

function JobCard({
  title,
  location,
  type,
  salary,
  status,
  applications,
  views,
  posted,
  deadline,
}) {
  return (
    <div className="bg-white shadow-sm rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">
            {location} • {type} • {salary}
          </p>
        </div>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
          {status}
        </span>
      </div>

      <div className="flex gap-4 mt-3 text-xs">
        <div className="bg-blue-50 px-2 py-1 rounded">
          {applications} Applications
        </div>
        <div className="bg-green-50 px-2 py-1 rounded">{views} Views</div>
        <div className="bg-yellow-50 px-2 py-1 rounded">Posted: {posted}</div>
        <div className="bg-red-50 px-2 py-1 rounded">Deadline: {deadline}</div>
      </div>

      <div className="flex gap-2 mt-3">
        <button className="bg-red-600 text-white px-2 py-1 rounded text-xs">
          View Applications
        </button>
        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          Share Job
        </button>
        <button className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
          Pause
        </button>
      </div>
    </div>
  );
}
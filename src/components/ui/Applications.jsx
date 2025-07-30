'use client';

import React, { useState } from 'react';
import CompanyNavbar from "./CompanyNavbar";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users2,
  Star,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

// بيانات وهمية للتجريب
const applications = {
  pending: [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Senior Electrical Technician",
      experience: "5 years",
      location: "Mumbai, Maharashtra",
      rating: "4.8",
      skills: ["Electrical Wiring", "Motor Repair", "PLC Programming"],
      date: "1/18/2024",
      image: "/avatar1.png"
    },
    {
      id: 2,
      name: "Neha Patel",
      role: "Electronics Technician",
      experience: "4 years",
      location: "Delhi, NCR",
      rating: "4.7",
      skills: ["Circuit Analysis", "PCB Design", "Testing & Debugging"],
      date: "1/15/2024",
      image: "/avatar2.png"
    }
  ],
  shortlisted: [],
  interviewed: [],
  rejected: []
};

// بطاقة متقدم واحد
const ApplicantCard = ({ applicant }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl mb-4 bg-white shadow-sm">
    <div className="flex items-start space-x-4">
      <img
        src={applicant.image}
        alt={applicant.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="font-semibold text-lg">{applicant.name}</h3>
        <p className="text-gray-600 text-sm">Applied for: {applicant.role}</p>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-red-600" /> {applicant.experience}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-600" /> {applicant.location}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {applicant.skills.map(skill => (
            <span
              key={skill}
              className="bg-red-100 text-red-800 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Applied on {applicant.date}</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0">
      <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
        <Star className="w-4 h-4" /> {applicant.rating}/5
      </span>
      <button className="bg-red-600 text-white px-4 py-2 rounded">View Profile</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded">Shortlist</button>
      <button className="bg-gray-300 text-black px-4 py-2 rounded">Reject</button>
      <button className="border px-4 py-2 rounded flex items-center gap-1">
        <MessageCircle className="w-4 h-4" /> Message
      </button>
    </div>
  </div>
);

// الصفحة الرئيسية
export default function CompanyApplications() {
  const [tab, setTab] = useState("pending");

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Company Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        {/* التبويبات العلوية */}
        <div className="flex gap-4 border-b mb-6">
          <Link
            href="/dashboard"
            className="px-4 py-2 flex items-center gap-1 text-gray-600 font-medium hover:text-red-600"
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link
            href="/companyjobs"
            className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600"
          >
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <button className="border-b-2 border-red-500 text-red-600 px-4 py-2 font-medium flex items-center gap-1">
            <Users2 className="w-4 h-4" /> Applications
          </button>
          <Link
            href="/companyprofile"
            className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600"
          >
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

       
        <h2 className="text-lg font-semibold mb-3">Job Applications</h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {["pending", "shortlisted", "interviewed", "rejected"].map(status => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`px-3 py-1 rounded text-sm ${
                tab === status
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({applications[status].length})
            </button>
          ))}
        </div>

        <div>
          {applications[tab].length > 0 ? (
            applications[tab].map(applicant => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))
          ) : (
            <p className="text-gray-500">No applications in this category.</p>
          )}
        </div>
      </main>
    </div>
  );
}
"use client";

import React from "react";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileEdit() {
  const company = {
    name: "TechCorp Industries",
    industry: "Manufacturing",
    location: "Mumbai, Maharashtra",
    size: "500-1000 employees",
    website: "www.techcorp.com",
    founded: "2008",
    email: "hr@techcorp.com",
    phone: "+91 98765 43210",
    description:
      "TechCorp Industries is a leading manufacturing company specializing in electrical equipment and industrial automation solutions. We have been serving clients across India for over 15 years.",
    rating: 4.8,
    reviews: 124,
    stats: {
      activeJobs: 12,
      totalHires: 247,
      successRate: "94%",
    },
    specializations: [
      "Electrical Equipment",
      "Industrial Automation",
      "Power Systems",
      "Control Panels",
    ],
  };

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <main className="p-6 max-w-7xl mx-auto">
        {/* Title & Back */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Edit Company Profile</h1>
          <Link
            href="/companyprofile"
            className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          Update your company details and stay up-to-date
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md grid md:grid-cols-3 gap-6">
          {/* LEFT SIDE - LOGO & STATS */}
          <div className="col-span-1">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 text-red-600 p-5 rounded-xl mb-3">
                <Building2 className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-lg">{company.name}</h2>
              <p className="text-sm text-gray-600">{company.industry}</p>
              <p className="text-yellow-600 text-sm mt-1">
                ⭐ {company.rating}/5{" "}
                <span className="text-gray-500">
                  ({company.reviews} reviews)
                </span>
              </p>
            </div>

            {/* Company Stats */}
            <div className="bg-red-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold mb-2 text-center">Company Stats</h3>
              <div className="text-sm text-center space-y-2">
                <p>
                  <span className="text-gray-600">Active Jobs: </span>
                  <span className="text-red-600 font-semibold">
                    {company.stats.activeJobs}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Total Hires: </span>
                  <span className="text-red-600 font-semibold">
                    {company.stats.totalHires}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Success Rate: </span>
                  <span className="text-red-600 font-semibold">
                    {company.stats.successRate}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Company Name", company.name],
                ["Industry", company.industry],
                ["Location", company.location],
                ["Company Size", company.size],
                ["Website", company.website],
                ["Founded", company.founded],
                ["Contact Email", company.email],
                ["Phone Number", company.phone],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="text-gray-500 text-sm">{label}</label>
                  <input
                    type="text"
                    defaultValue={value}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-gray-500 text-sm">Company Description</label>
              <textarea
                rows={4}
                defaultValue={company.description}
                className="w-full border rounded px-3 py-2 text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-gray-500 text-sm mb-2 block">
                Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {company.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">
                Save Changes
              </button>
              <Link href="/companyprofile">
                <button className="border px-5 py-2 rounded hover:bg-gray-100">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import React from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function PostJob() {
  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <main className="p-6 max-w-5xl mx-auto">
        {/* Title & Back */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>
          <Link
            href="/companyjobs"
            className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Jobs
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          Connect with skilled ITI graduates for your projects
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
          {/* Job Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Electrical Technician, Welder, Mechanic"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Company Name *</label>
              <input
                type="text"
                placeholder="Your company name"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Location *</label>
              <input
                type="text"
                placeholder="City, State"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Job Type *</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Experience Level *</label>
              <select className="w-full border rounded px-3 py-2 mt-1">
                <option>Entry Level (0-2 years)</option>
                <option>Mid Level (2-5 years)</option>
                <option>Senior Level (5+ years)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500">Salary Range</label>
              <input
                type="text"
                placeholder="e.g. ₹15,000 – ₹25,000 per month"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Required Skills *</label>
            <input
              type="text"
              placeholder="e.g. Electrical wiring, Motor repair, PLC programming"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Job Description *</label>
            <textarea
              placeholder="Describe the job role, responsibilities, and what you’re looking for..."
              rows={4}
              maxLength={500}
              className="w-full border rounded px-3 py-2 mt-1"
            ></textarea>
            <p className="text-xs text-gray-400 text-right mt-1">0/500 characters</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Requirements</label>
            <textarea
              placeholder="List specific qualifications, certifications, or experience needed..."
              rows={3}
              maxLength={500}
              className="w-full border rounded px-3 py-2 mt-1"
            ></textarea>
            <p className="text-xs text-gray-400 text-right mt-1">0/500 characters</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Contact Email *</label>
              <input
                type="email"
                placeholder="hr@company.com"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Application Deadline</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="pt-4 text-center">
            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 mx-auto">
              <Send className="w-4 h-4" />
              Post Job
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
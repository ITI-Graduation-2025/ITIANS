'use client';

import React from 'react';
import CompanyNavbar from './CompanyNavbar';
import {
  LayoutDashboard,
  FileText,
  Users2,
  Building2,
  Pencil
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyProfile() {
  const company = {
    name: 'TechCorp Industries',
    industry: 'Manufacturing',
    location: 'Mumbai, Maharashtra',
    size: '500-1000 employees',
    website: 'www.techcorp.com',
    founded: '2008',
    email: 'hr@techcorp.com',
    phone: '+91 98765 43210',
    description:
      'TechCorp Industries is a leading manufacturing company specializing in electrical equipment and industrial automation solutions. We have been serving clients across India for over 15 years.',
    rating: 4.8,
    reviews: 124,
    stats: {
      activeJobs: 12,
      totalHires: 247,
      successRate: '94%',
    },
    specializations: [
      'Electrical Equipment',
      'Industrial Automation',
      'Power Systems',
      'Control Panels',
    ],
  };

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Company Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboard" className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <Link href="/Applicationjob" className="px-4 py-2 flex items-center gap-1 text-gray-600 hover:text-red-600">
            <Users2 className="w-4 h-4" /> Applications
          </Link>
           <Link
    href="/companyprofile"
    className="border-b-2 border-red-500 text-red-600 px-4 py-2 font-medium flex items-center gap-1"
  >
    <Building2 className="w-4 h-4" /> Company Profile
  </Link>
        </div>

        {/* Profile Info */}
        <section className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-600 p-4 rounded-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{company.name}</h2>
                <p className="text-sm text-gray-600">{company.industry}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  ⭐ {company.rating}/5 <span className="text-gray-500">({company.reviews} reviews)</span>
                </p>
              </div>
            </div>
           <Link
  href="/ProfileEdit"
  className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-red-700 transition"
>
  <Pencil className="w-4 h-4" /> Edit Profile
</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Company Name</p>
              <p className="font-medium">{company.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Industry</p>
              <p className="font-medium">{company.industry}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="font-medium">{company.location}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Company Size</p>
              <p className="font-medium">{company.size}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Website</p>
              <p className="font-medium">{company.website}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Founded</p>
              <p className="font-medium">{company.founded}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Contact Email</p>
              <p className="font-medium">{company.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="font-medium">{company.phone}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Company Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Active Jobs:</p>
                <p className="text-red-600 font-semibold">{company.stats.activeJobs}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Hires:</p>
                <p className="text-red-600 font-semibold">{company.stats.totalHires}</p>
              </div>
              <div>
                <p className="text-gray-600">Success Rate:</p>
                <p className="text-red-600 font-semibold">{company.stats.successRate}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Company Description</h3>
            <p className="text-gray-700 text-sm">{company.description}</p>
          </div>

          {/* Specializations */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Specializations</h3>
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
        </section>
      </main>
    </div>
  );
}
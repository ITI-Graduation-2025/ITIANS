'use client';

import React, { useEffect, useState } from 'react';
import CompanyNavbar from './CompanyNavbar';
import {
  LayoutDashboard,
  FileText,
  Users2,
  Building2,
  Pencil,
 TrendingUp,
  Briefcase,
  MapPin,
  Users,
  Globe,
  Calendar,
  Mail,
  Phone,
  BarChart3,
  UserCheck,
  AlignLeft,
  Info,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { db } from "@/config/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const companyId = session?.user?.id;

  // ✅ حماية الصفحة - السماح فقط للشركات
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'company') {
      router.push('/unauthorized');
    }
  }, [session, status]);

  // ✅ تحميل بيانات الشركة
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (!companyId) return;

        const docRef = doc(db, 'users', companyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const companyData = docSnap.data();

          const jobsSnapshot = await getDocs(collection(db, 'jobs'));
          const jobs = jobsSnapshot.docs.map((doc) => doc.data());

          const activeJobs = jobs.filter(
            (job) => job.status === 'Active' && job.companyId === companyId
          ).length;

          let totalHires = 0;
          let totalApplicants = 0;

          jobs.forEach((job) => {
            if (job.companyId === companyId && Array.isArray(job.applicants)) {
              job.applicants.forEach((applicant) => {
                if (typeof applicant === 'object' && applicant.status) {
                  totalApplicants++;
                  if (applicant.status.toLowerCase() === 'approved') {
                    totalHires++;
                  }
                }
              });
            }
          });

          const successRate =
            totalApplicants > 0
              ? `${Math.round((totalHires / totalApplicants) * 100)}%`
              : '0%';

          setCompany({
            ...companyData,
            stats: {
              totalHires,
              successRate,
              activeJobs
            }
          });
        } else {
          console.log('No company profile found for:', companyId);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  // ✅ Skeleton أثناء التحميل
  if (!company) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="mt-6 h-24 bg-gray-200 rounded"></div>
        <div className="mt-6 h-20 bg-gray-200 rounded"></div>
        <div className="mt-6 h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  // ✅ محتوى الصفحة
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <CompanyNavbar />

      <main className="p-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#b30000]">
            {company?.name}{' '}
            <span className="text-[#203947] text-2xl">Dashboard</span>
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Manage your job postings and find the best ITI talent
        </p>

        <div className="flex gap-4 border-b mb-6">
          <Link href="/dashboardCompany" className="px-4 py-2 flex items-center gap-1 text-[#203947] font-medium hover:text-[#b30000] transition">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/companyjobs" className="px-4 py-2 flex items-center gap-1 text-[#203947] hover:text-[#b30000] font-medium">
            <FileText className="w-4 h-4" /> My Jobs
          </Link>
          <Link href="/AllCompanyApplicants" className="px-4 py-2 flex items-center font-medium gap-1 text-[#203947] hover:text-[#b30000]">
            <Users2 className="w-4 h-4" /> Applications
          </Link>
          <Link href="/companyprofile" className="text-[#b30000] border-b-2 border-[#b30000] px-4 py-2 font-medium flex items-center gap-1 hover:text-[#b30000] transition">
            <Building2 className="w-4 h-4" /> Company Profile
          </Link>
        </div>

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
                  {company.rating > 0 ? (
                    <>
                      ⭐ {company.rating}/5{' '}
                      <span className="text-gray-500">
                        ({company.reviews} reviews)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No rating yet</span>
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/ProfileEdit"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span >Edit Profile</span>
            </Link>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  p-6  ">
            <div className="flex items-start gap-3">
              <Building2 className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold ">Company Name</p>
                <p className=" text-[#333]">{company.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-800 font-semibold ">Industry</p>
                <p className=" text-[#333]">{company.industry}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold ">Location</p>
                <p className=" text-[#333]">{company.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold">Company Size</p>
                <p className=" text-[#333]">{company.size}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold">Website</p>
                <a
                  href={company.website}
                  className="font-semibold text-[#b30000] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold  ">Founded</p>
                <p className="text-[#333]">{company.founded}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold">Contact Email</p>
                <p className=" text-[#333]">{company.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-[#b30000] w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-900 font-semibold">Phone Number</p>
                <p className=" text-[#333]">{company.phone}</p>
              </div>
            </div>
          </div>

        <div className="mt-6 bg-red-50 p-4 rounded-lg text-center">
            <h3 className="font-semibold mb-4 flex items-center justify-center gap-1 text-gray-900">
              <BarChart3 className="w-4 h-4 text-[#b30000]" />
              Company Stats
            </h3>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-gray-900 font-semibold">
        <Briefcase className="w-4 h-4 text-[#8B0000]" />
        <p>Active Jobs:</p>
      </div>
      <p className="text-red-600 font-semibold">{company.stats.activeJobs}</p>
    </div>

    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 font-semibold text-gray-900">
        <UserCheck className="w-4 h-4 text-[#8B0000]" />
        <p>Total Hires:</p>
      </div>
      <p className="text-red-600 font-semibold">{company.stats.totalHires}</p>
    </div>

    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 font-semibold text-gray-900">
        <TrendingUp className="w-4 h-4 text-[#8B0000]" />
        <p>Success Rate:</p>
      </div>
      <p className="text-red-600 font-semibold">{company.stats.successRate}</p>
    </div>
  </div>
</div>


          <div className="flex items-start gap-3 mt-6">
  < Building2 className="text-[#b30000] w-5 h-5 mt-1" />
  <div>
    <p className="text-gray-900 font-semibold">Company Description</p>
    <p className="text-[#333]">{company.description}</p>
  </div>
</div>


          <div className="flex items-start gap-3 mt-6">
  <ListChecks className="text-[#b30000] w-5 h-5 mt-1" />
  <div>
    <p className="text-gray-900 font-semibold">Specializations</p>
    <div className="flex flex-wrap gap-2 mt-1">
      {company.specializations?.map((spec) => (
        <span
          key={spec}
          className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 px-3 py-1 text-xs rounded-full shadow-sm"
        >
          {spec}
        </span>
      ))}
    </div>
  </div>
</div>
        </section>
      </main>
    </div>
  );
}



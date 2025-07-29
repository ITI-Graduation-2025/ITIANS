"use client";

import {
  Star,
  MapPin,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Mail,
  Linkedin,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function ProfileViewCom() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!companyId) return;

    const unsub = onSnapshot(doc(db, "users", companyId), (snap) => {
      if (snap.exists()) {
        setCompany(snap.data());
      }
    });

    const fetchJobs = async () => {
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", companyId)
      );
      const snap = await getDocs(q);
      const jobList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    };

    fetchJobs();
    return () => unsub();
  }, [companyId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      {company && (
        <div
          className="text-white p-6 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/business-people-working-office_23-2148902353.jpg')",
          }}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Image
                src={company.logo || "/default-logo.png"}
                alt="Company Logo"
                width={48}
                height={48}
                className="rounded-md shadow bg-white"
              />
              <div>
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <p>{company.industry}</p>
                <div className="flex space-x-2 text-sm mt-1 items-center">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                  <span>
                    • {company.size} employees • Founded {company.founded}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="flex items-center justify-end gap-1">
                <Star className="w-4 h-4 text-yellow-300" /> {company.rating || 0}
              </p>
              <p className="text-sm">{company.reviews || 0} reviews</p>
              <button className="mt-2 px-4 py-1 bg-white text-blue-700 rounded shadow">
                Follow Company
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Jobs Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">
            Active Job Postings{" "}
            <span className="text-sm text-gray-500">
              ({jobs.length} open position{jobs.length !== 1 ? "s" : ""})
            </span>
          </h2>
          <div className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white shadow rounded p-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600 flex gap-2">
                      {job.salary || "N/A"} • {job.duration || "N/A"} •{" "}
                      {job.proposals?.length || 0} proposals
                    </p>
                    <div className="space-x-2 mt-1">
                      {Array.isArray(job.skills) &&
                        job.skills.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {job.postedDate || "Just now"}
                  </div>
                </div>
                <button className="text-blue-600 text-sm mt-1">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Company Statistics</h2>
            <ul className="text-sm mt-2 space-y-1">
              <li className="flex gap-2 items-center">
                <Briefcase className="w-4 h-4" /> {jobs.length} Active Jobs
              </li>
              <li className="flex gap-2 items-center">
                <Users className="w-4 h-4" /> {company?.size || "N/A"} Employees
              </li>
              <li className="flex gap-2 items-center">
                <CheckCircle className="w-4 h-4" /> 98% Success Rate
              </li>
              <li className="flex gap-2 items-center">
                <Clock className="w-4 h-4" /> 2 hours Avg Response
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">About {company?.name}</h2>
            <p className="text-sm mt-1">{company?.description || "No description available."}</p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Contact Information</h2>
            <div className="text-sm mt-1 space-y-1">
              {company?.website && (
                <p>
                  <Globe className="inline w-4 h-4 mr-1" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              )}
              {company?.email && (
                <p>
                  <Mail className="inline w-4 h-4 mr-1" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.email}
                  </a>
                </p>
              )}
              {company?.linkedin && (
                <p>
                  <Linkedin className="inline w-4 h-4 mr-1" />
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.linkedin}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

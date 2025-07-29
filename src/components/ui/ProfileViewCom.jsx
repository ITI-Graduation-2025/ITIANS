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
  Home,
  MessageCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Messages", href: "/messages", icon: MessageCircle },
];

function Dropdowncom() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
      >
        <User size={20} className="text-gray-700" />
        <span className="text-gray-800 font-medium">Admin</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50 w-48">
          <Link
            href="/dashboardCompany"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User size={16} />
            My dashboard
          </Link>
          <Link
            href="/settingsform"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Image
          src="data:image/png;base64,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"
          alt="ITI Logo"
          width={30}
          height={30}
        />
      </div>

      <div className="flex space-x-4 items-center text-sm font-medium">
        {tabs.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-[#E30613]/10 text-[#E30613] font-semibold ring-1 ring-[#E30613]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#E30613]"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </div>

      <Dropdowncom />
    </nav>
  );
}

export default function ProfileViewCom() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!companyId) return;

    const unsub = onSnapshot(doc(db, "users", companyId), (snap) => {
      if (snap.exists()) setCompany(snap.data());
    });

    const fetchJobs = async () => {
      const q = query(collection(db, "jobs"), where("companyId", "==", companyId));
      const snap = await getDocs(q);
      const jobList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
    };

    fetchJobs();
    return () => unsub();
  }, [companyId]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

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
              <div className="flex items-center justify-end gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < company.rating ? "text-yellow-300" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">{company.reviews || 0} reviews</p>
              {session?.user?.id === companyId && (
                <Link
                  href="/edit-company"
                  className="mt-2 inline-block px-4 py-1 bg-white text-blue-700 rounded shadow text-sm"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
                        job.skills.map((tag, i) => (
                          <span
                            key={i}
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
                <button className="text-blue-600 text-sm mt-2 hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>

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
            <p className="text-sm mt-1">
              {company?.description || "No description available."}
            </p>
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



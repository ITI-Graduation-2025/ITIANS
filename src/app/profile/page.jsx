"use client";

import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaCertificate,
  FaBriefcase,
  FaDollarSign,
} from "react-icons/fa";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(null);

  const [aboutValue, setAboutValue] = useState(
    "Passionate web developer skilled in React, TailwindCSS and modern web technologies."
  );
  const [educationValue, setEducationValue] = useState(
    "ITI Diploma - Web UI Track, 2025"
  );
  const [rateValue, setRateValue] = useState("$20/hr");
  const [hoursValue, setHoursValue] = useState("30 hours/week");
  const [languagesValue, setLanguagesValue] = useState([
    "English",
    "Arabic",
  ]);
  const [linksValue, setLinksValue] = useState({
    github: "https://github.com/jihan",
    linkedin: "https://linkedin.com/in/jihan",
  });
  const [certificatesValue, setCertificatesValue] = useState([
    { title: "ITI Graduation Certificate", year: 2025 },
    { title: "Udemy React Course", year: 2024 },
  ]);

  const [completedJobs, setCompletedJobs] = useState([
    {
      role: "Frontend Developer",
      company: "Freelancer",
      date: "Jan 2024 - Mar 2024",
      details: "Built responsive UI for a client project.",
      price: "$500",
    },
    {
      role: "React Developer",
      company: "Upwork Client",
      date: "Aug 2023 - Dec 2023",
      details: "Developed a dashboard using React and TailwindCSS.",
      price: "$800",
    },
  ]);

  const [inProgressJobs, setInProgressJobs] = useState([
    {
      role: "Full Stack Developer",
      company: "Freelancer",
      date: "Apr 2024 - Present",
      details: "Working on a MERN stack web app.",
      price: "$1200",
      expectedEnd: "Jul 2024",
    },
  ]);

  const student = {
    fullName: "Jihan Mohamed",
    email: "jihan@example.com",
    profileImage: "https://i.pravatar.cc/100?img=5",
  };

  const handleSave = () => setIsModalOpen(null);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9afXVML2UMaMFwb3fzaIxlIxIlm2EkVefeQ&s"
            alt="ITI"
            className="h-10"
          />
          <nav className="flex gap-6 text-sm text-gray-700">
            <a
              href="#"
              className="text-[#B71C1C] font-medium hover:underline"
            >
              Find Work
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              My Jobs
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              Orders
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              Messages
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={student.profileImage}
            alt={student.fullName}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{student.fullName}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="h-48 bg-gradient-to-r from-[#B71C1C] to-red-300" />

      {/* Card */}
      <main className="-mt-20 max-w-3xl mx-auto px-4 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-4 relative">
          <div className="flex items-center gap-4">
            <img
              src={student.profileImage}
              alt={student.fullName}
              className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold text-[#B71C1C]">
                {student.fullName}
              </h1>
              <p className="text-black flex items-center gap-1 text-sm">
                <FaEnvelope /> {student.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-center">
            <div>
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-base font-semibold text-[#B71C1C]">$1200</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Jobs</p>
              <p className="text-base font-semibold text-[#B71C1C]">8</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Hours</p>
              <p className="text-base font-semibold text-[#B71C1C]">250</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <ProfileItem
              title="About Me"
              value={aboutValue}
              onEdit={() => setIsModalOpen("about")}
            />
            <ProfileItem
              title="Education"
              value={educationValue}
              onEdit={() => setIsModalOpen("education")}
            />
            <ProfileItem
              title="Hourly Rate"
              value={rateValue}
              onEdit={() => setIsModalOpen("rate")}
            />
            <ProfileItem
              title="Hours/Week"
              value={hoursValue}
              onEdit={() => setIsModalOpen("hours")}
            />
            <ProfileItem
              title="Languages"
              value={languagesValue.join(", ")}
              onEdit={() => setIsModalOpen("languages")}
            />
            <div>
              <p className="text-gray-500">Links</p>
              <div className="flex gap-3 text-[#B71C1C] text-lg mt-1">
                <a href={linksValue.github} target="_blank">
                  <FaGithub />
                </a>
                <a href={linksValue.linkedin} target="_blank">
                  <FaLinkedin />
                </a>
                <button
                  className="ml-auto text-gray-400 hover:text-[#B71C1C] text-base"
                  onClick={() => setIsModalOpen("links")}
                >
                  <FiEdit />
                </button>
              </div>
            </div>
          </div>
        </div>

       
        <ModernSection
          icon={<FaCertificate className="text-[#B71C1C] text-xl" />}
          title="Certificates"
          value={certificatesValue.map((c, i) => (
            <div key={i} className="text-sm">
              {c.title} ({c.year})
            </div>
          ))}
          onEdit={() => setIsModalOpen("certificates")}
        />

       
        <WorkHistorySection
          completedJobs={completedJobs}
          inProgressJobs={inProgressJobs}
          onEdit={() => setIsModalOpen("work")}
        />
      </main>

     
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(null)} onSave={handleSave}>
          <h2 className="text-lg font-semibold mb-2 capitalize">
            Edit {isModalOpen}
          </h2>
        </Modal>
      )}
    </div>
  );
}

function ProfileItem({ title, value, onEdit }) {
  return (
    <div>
      <p className="text-[#B71C1C] font-medium">{title}</p>
      <p className="text-black flex justify-between items-center">
        {value}
        <button
          className="text-gray-400 hover:text-[#B71C1C]"
          onClick={onEdit}
        >
          <FiEdit />
        </button>
      </p>
    </div>
  );
}

function ModernSection({ icon, title, value, onEdit }) {
  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-[#B71C1C]">{title}</h2>
        </div>
        <button
          className="text-gray-400 hover:text-[#B71C1C]"
          onClick={onEdit}
        >
          <FiEdit />
        </button>
      </div>
      <div className="mt-2 text-black">{value}</div>
    </div>
  );
}

function WorkHistorySection({ completedJobs, inProgressJobs, onEdit }) {
  const [activeTab, setActiveTab] = useState("completed");

  const jobs = activeTab === "completed" ? completedJobs : inProgressJobs;

  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <FaBriefcase className="text-[#B71C1C] text-xl" />
          <h2 className="text-lg font-semibold text-[#B71C1C]">
            Work History
          </h2>
        </div>
        <button
          className="text-gray-400 hover:text-[#B71C1C]"
          onClick={onEdit}
        >
          <FiEdit />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex gap-4 mb-2">
          <button
            className={`text-sm px-3 py-1 rounded ${
              activeTab === "completed"
                ? "bg-[#B71C1C] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Jobs
          </button>
          <button
            className={`text-sm px-3 py-1 rounded ${
              activeTab === "inProgress"
                ? "bg-[#B71C1C] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => setActiveTab("inProgress")}
          >
            In Progress
          </button>
        </div>

        {jobs.map((job, i) => (
          <div
            key={i}
            className="mb-3 p-3 bg-gray-50 rounded border text-sm text-black"
          >
            <div className="flex justify-between font-medium text-[#B71C1C]">
              <span>
                {job.role} at {job.company}
              </span>
              <span className="text-xs text-gray-600">{job.date}</span>
            </div>
            <div className="mt-1">{job.details}</div>
            {activeTab === "completed" && job.price && (
              <div className="mt-1 text-sm text-gray-800">
                <FaDollarSign /> {job.price}
              </div>
            )}
            {activeTab === "inProgress" && job.expectedEnd && (
              <div className="mt-1 text-xs text-gray-500">
                Expected Completion: {job.expectedEnd}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({ children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#B71C1C] text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


















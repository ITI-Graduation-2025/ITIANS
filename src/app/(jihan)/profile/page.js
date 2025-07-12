"use client";

import React, { useState, useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown/page";
import CertificateSelect from "../CertificateSelect/Page"
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
  const [showDropdown, setShowDropdown] = useState(false);

  const [aboutValue, setAboutValue] = useState(
    "Passionate web developer skilled in React, TailwindCSS and modern web technologies."
  );
  const [educationValue, setEducationValue] = useState({
    university: "ITI",
    major: "Web UI",
    graduationYear: 2025,
  });
  const [rateValue, setRateValue] = useState("$20/hr");
  const [hoursValue, setHoursValue] = useState("30 hours/week");
  const [languagesValue, setLanguagesValue] = useState(["English", "Arabic"]);
  const [linksValue, setLinksValue] = useState({
    github: "https://github.com/jihan",
    linkedin: "https://linkedin.com/in/jihan",
  });
  const [certificatesValue, setCertificatesValue] = useState([
    { title: "ITI Graduation Certificate", year: 2025 },
  ]);

  const [completedJobs, setCompletedJobs] = useState([
    {
      role: "Frontend Developer",
      company: "Freelancer",
      date: "Jan 2024 - Mar 2024",
      details: "Built responsive UI for a client project.",
      price: "$500",
      status: "completed",
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
      status: "inProgress",
    },
  ]);

  const [editingJob, setEditingJob] = useState({ tab: "completed", index: null });

  const trustedCertificates = [
    "ITI Graduation Certificate",
    "Udemy React Course",
    "Coursera Fullstack Specialization",
    "Harvard CS50",
  ];

  const student = {
    fullName: "Jihan Mohamed",
    email: "jihan@example.com",
    profileImage: "https://i.pravatar.cc/100?img=5",
  };

  const handleSave = () => setIsModalOpen(null);

  const handleEditJob = (tab, index) => {
    setEditingJob({ tab, index });
    setIsModalOpen("work");
  };

  const handleDeleteJob = (tab, index) => {
    if (tab === "completed") {
      setCompletedJobs(completedJobs.filter((_, i) => i !== index));
    } else {
      setInProgressJobs(inProgressJobs.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9afXVML2UMaMFwb3fzaIxlIxIlm2EkVefeQ&s"
            alt="ITI"
            className="h-10"
          />
          <nav className="flex gap-6 text-sm text-gray-700">
            <a href="#" className="text-[#B71C1C] font-medium hover:underline">
              Find Work
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              My Jobs
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              Messages
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2 relative">
          <img
            src={student.profileImage}
            alt={student.fullName}
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <div>
            <p className="text-sm font-medium">{student.fullName}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>

          {showDropdown && (
            <div className="absolute top-10 right-0 z-50">
              <ProfileDropdown />
            </div>
          )}
        </div>
      </header>

      <div className="h-48 bg-gradient-to-r from-[#B71C1C] to-red-300" />

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
              <p className="text-black text-sm">Freelancer</p>
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
              value={`${educationValue.university} - ${educationValue.major} (${educationValue.graduationYear})`}
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
                <a href={linksValue.github} target="_blank" rel="noreferrer">
                  <FaGithub />
                </a>
                <a href={linksValue.linkedin} target="_blank" rel="noreferrer">
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
          onEdit={handleEditJob}
          onDeleteJob={handleDeleteJob}
        />
      </main>

      {isModalOpen && (
        <Modal
          type={isModalOpen}
          onClose={() => setIsModalOpen(null)}
          onSave={handleSave}
          aboutValue={aboutValue}
          setAboutValue={setAboutValue}
          educationValue={educationValue}
          setEducationValue={setEducationValue}
          rateValue={rateValue}
          setRateValue={setRateValue}
          hoursValue={hoursValue}
          setHoursValue={setHoursValue}
          languagesValue={languagesValue}
          setLanguagesValue={setLanguagesValue}
          linksValue={linksValue}
          setLinksValue={setLinksValue}
          certificatesValue={certificatesValue}
          setCertificatesValue={setCertificatesValue}
          trustedCertificates={trustedCertificates}
          completedJobs={completedJobs}
          setCompletedJobs={setCompletedJobs}
          inProgressJobs={inProgressJobs}
          setInProgressJobs={setInProgressJobs}
          editingJob={editingJob}
        />
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
        <button className="text-gray-400 hover:text-[#B71C1C]" onClick={onEdit}>
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
        <button className="text-gray-400 hover:text-[#B71C1C]" onClick={onEdit}>
          <FiEdit />
        </button>
      </div>
      <div className="mt-2 text-black">{value}</div>
    </div>
  );
}

function WorkHistorySection({ completedJobs, inProgressJobs }) {
  const [activeTab, setActiveTab] = useState("completed");
  const jobs = activeTab === "completed" ? completedJobs : inProgressJobs;

  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <FaBriefcase className="text-[#B71C1C] text-xl" />
          <h2 className="text-lg font-semibold text-[#B71C1C]">Work History</h2>
        </div>
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


function Modal(props) {
  const {
    type,
    onClose,
    onSave,
    aboutValue,
    setAboutValue,
    educationValue,
    setEducationValue,
    rateValue,
    setRateValue,
    hoursValue,
    setHoursValue,
    languagesValue,
    setLanguagesValue,
    linksValue,
    setLinksValue,
    certificatesValue,
    setCertificatesValue,
    trustedCertificates,
    completedJobs = [],
    setCompletedJobs = () => {},
    inProgressJobs = [],
    setInProgressJobs = () => {},
    editingJob = { tab: "completed", index: null },
  } = props;

  const [tempValue, setTempValue] = React.useState("");

  React.useEffect(() => {
    if (type === "certificates") setTempValue(certificatesValue[0]?.title || "");
    else if (type === "links") setTempValue({ ...linksValue });
    else if (type === "languages") setTempValue(languagesValue.join(", "));
    else if (type === "education") setTempValue({ ...educationValue });
    else if (type === "hours") setTempValue(hoursValue);
    else if (type === "rate") setTempValue(rateValue);
    else if (type === "about") setTempValue(aboutValue);
    else if (type === "work") {
      if (editingJob?.index !== null) {
        const job =
          editingJob.tab === "completed"
            ? completedJobs[editingJob.index]
            : inProgressJobs[editingJob.index];
        setTempValue({ ...job });
      } else {
        setTempValue({
          role: "",
          company: "",
          date: "",
          details: "",
          price: "",
          expectedEnd: "",
          status: editingJob?.tab || "completed",
        });
      }
    }
  }, [
    type,
    editingJob,
    certificatesValue,
    linksValue,
    languagesValue,
    educationValue,
    hoursValue,
    rateValue,
    aboutValue,
    completedJobs,
    inProgressJobs,
  ]);

  const save = () => {
    switch (type) {
      case "about":
        setAboutValue(tempValue);
        break;
      case "education":
        setEducationValue(tempValue);
        break;
      case "rate":
        setRateValue(tempValue);
        break;
      case "hours":
        setHoursValue(tempValue);
        break;
      case "languages":
        setLanguagesValue(tempValue.split(",").map((l) => l.trim()));
        break;
      case "links":
        setLinksValue(tempValue);
        break;
      case "certificates":
        setCertificatesValue([
          { title: tempValue, year: new Date().getFullYear() },
        ]);
        break;
      case "work":
        if (editingJob.tab === "completed") {
          const updated = [...completedJobs];
          if (editingJob.index !== null) {
            updated[editingJob.index] = tempValue;
          } else {
            updated.push(tempValue);
          }
          setCompletedJobs(updated);
        } else {
          const updated = [...inProgressJobs];
          if (editingJob.index !== null) {
            updated[editingJob.index] = tempValue;
          } else {
            updated.push(tempValue);
          }
          setInProgressJobs(updated);
        }
        break;
      default:
        break;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 space-y-4 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold capitalize">Edit {type}</h2>

        {type === "about" ? (
          <div className="space-y-2">
            <label
              htmlFor="aboutText"
              className="text-sm font-medium text-gray-700"
            >
              About You
            </label>
            <p className="text-xs text-gray-500">
              Describe your skills, experience, and what you offer to clients.
            </p>

            <textarea
              id="aboutText"
              rows="5"
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., I'm a frontend developer with 3+ years of experience building responsive web apps..."
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />

            <p className="text-xs text-gray-500 mt-1">
              This is the first thing clients will see on your profile.
            </p>
          </div>
        ) : type === "rate" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Profile Hourly Rate
            </label>
            <p className="text-xs text-gray-500">
              How much you’ll charge clients per hour for your work.
            </p>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min="1"
                className="w-full border px-6 py-2 rounded text-right"
                value={tempValue.replace("$", "").replace("/hr", "")}
                onChange={(e) =>
                  setTempValue(`$${e.target.value}/hr`)
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This is the rate clients will see on your profile and in search
              results.
            </p>
          </div>
        ) : type === "hours" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Availability
            </label>
            <p className="text-xs text-gray-500">
              How many hours per week are you available for work?
            </p>

            <select
              className="w-full border px-3 py-2 rounded"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            >
              <option>As Needed — Open to Offers</option>
              <option>Less than 30 hrs/week</option>
              <option>More than 30 hrs/week</option>
            </select>

            <p className="text-xs text-gray-500 mt-1">
              You can update your availability anytime from your profile.
            </p>
          </div>
        ) : type === "languages" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Languages You Speak
            </label>
            <p className="text-xs text-gray-500">
              Add the languages you can communicate in with clients.
            </p>

            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., English, Arabic"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />

            <p className="text-xs text-gray-500 mt-1">
              Separate multiple languages with commas.
            </p>
          </div>
        ) : type === "certificates" ? (
          <CertificateSelect
            value={tempValue}
            onChange={setTempValue}
            options={trustedCertificates}
          />
        ) : type === "links" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Online Profiles
            </label>
            <p className="text-xs text-gray-500">
              Share links to your professional online profiles.
            </p>

            <input
              type="url"
              className="w-full border px-3 py-2 rounded"
              placeholder="GitHub Profile"
              value={tempValue.github || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, github: e.target.value })
              }
            />

            <input
              type="url"
              className="w-full border px-3 py-2 rounded"
              placeholder="LinkedIn Profile"
              value={tempValue.linkedin || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, linkedin: e.target.value })
              }
            />

            <p className="text-xs text-gray-500 mt-1">
              Clients will be able to view these profiles from your portfolio.
            </p>
          </div>
        ) : type === "education" ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="School / University"
              value={tempValue.university || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, university: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Degree / Major"
              value={tempValue.major || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, major: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Year of Graduation"
              value={tempValue.graduationYear || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, graduationYear: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ) : type === "work" ? (
          <WorkForm tempValue={tempValue} setTempValue={setTempValue} />
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-[#B71C1C] text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}




"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";

const jobList = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "Build modern UIs using React, Tailwind & modern tooling. You will be responsible for building and maintaining responsive interfaces and working closely with our design and backend teams.",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: 2,
    title: "AI Research Assistant",
    company: "DeepCore Labs",
    description:
      "Assist in AI research and TensorFlow model training. You'll be involved in data preprocessing, model tuning, and performance evaluation.",
    location: "Alexandria, Egypt",
    type: "Internship",
    experience: "Students / Fresh grads",
  },
  {
    id: 3,
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    description:
      "Monitor systems and protect data from threats. You'll investigate incidents, apply countermeasures, and ensure compliance with security standards.",
    location: "Remote",
    type: "Full-time",
    experience: "1+ year",
  },
  {
    id: 4,
    title: "Mobile Developer",
    company: "AppWave",
    description:
      "Develop cross-platform apps using Flutter or React Native. Collaborate with designers and backend engineers to deliver seamless experiences.",
    location: "Giza, Egypt",
    type: "Part-time",
    experience: "1+ year",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "PixelPerfect",
    description:
      "Design intuitive and delightful user experiences. Create wireframes, prototypes, and work closely with developers to implement designs.",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "Insightify",
    description:
      "Analyze business data and create insightful dashboards. Utilize SQL, Excel, and BI tools to support decision-making.",
    location: "Remote",
    type: "Contract",
    experience: "3+ years",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "CloudOps Co.",
    description:
      "Automate deployments, CI/CD pipelines, and manage cloud infrastructure. You will ensure system stability and performance.",
    location: "Nasr City, Egypt",
    type: "Full-time",
    experience: "3+ years",
  },
];

export default function JobDetailsPage() {
  const { id } = useParams();
  const job = jobList.find((j) => j.id === Number(id));
  const [showForm, setShowForm] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  if (!job)
    return <p className="p-10 text-center text-red-700">Job not found.</p>;

  return (
    <section className="min-h-screen bg-[#FFFBF5] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-[#E8D8C4] rounded-xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#B71C1C] mb-2">{job.title}</h2>
        <p className="text-lg font-medium text-[#6D2932] mb-4">{job.company}</p>

        <div className="flex flex-wrap gap-4 text-sm text-[#6D2932] mb-6">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBriefcase />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock />
            <span>{job.experience}</span>
          </div>
        </div>

        <p className="text-[#333] leading-relaxed mb-8">{job.description}</p>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#8B0000] transition font-semibold"
          >
            Apply Now
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Application submitted 🎉");
              setShowForm(false);
            }}
            className="space-y-5 mt-6"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full border border-[#ccc] rounded px-4 py-2"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full border border-[#ccc] rounded px-4 py-2"
            />
            <div>
              <label className="block mb-1 text-sm font-medium text-[#333]">
                Upload Your CV
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={(e) => setCvFile(e.target.files[0])}
                className="w-full border border-[#ccc] rounded px-4 py-2 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#B71C1C] file:text-white file:rounded file:cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-[#B71C1C] underline hover:text-[#8B0000]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#B71C1C] text-white px-6 py-2 rounded hover:bg-[#8B0000] transition"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}

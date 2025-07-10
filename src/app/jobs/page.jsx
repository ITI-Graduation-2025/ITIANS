"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock, FaBriefcase } from "react-icons/fa";
import Link from "next/link";

const jobList = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description: "Build modern UIs using React, Tailwind & modern tooling.",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: 2,
    title: "AI Research Assistant",
    company: "DeepCore Labs",
    description: "Assist in AI research and TensorFlow model training.",
    location: "Alexandria, Egypt",
    type: "Internship",
    experience: "Students / Fresh grads",
  },
  {
    id: 3,
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    description: "Monitor systems and protect data from threats.",
    location: "Remote",
    type: "Full-time",
    experience: "1+ year",
  },
  {
    id: 4,
    title: "Mobile Developer",
    company: "AppWave",
    description: "Develop cross-platform apps using Flutter or React Native.",
    location: "Giza, Egypt",
    type: "Part-time",
    experience: "1+ year",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "PixelPerfect",
    description: "Design intuitive and delightful user experiences.",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "Insightify",
    description: "Analyze business data and create insightful dashboards.",
    location: "Remote",
    type: "Contract",
    experience: "3+ years",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "CloudOps Co.",
    description: "Automate deployments, CI/CD and manage cloud services.",
    location: "Nasr City, Egypt",
    type: "Full-time",
    experience: "3+ years",
  },
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  return (
    <section className="min-h-screen bg-[#FFFBF5] py-20 px-6">
      <h2 className="text-4xl font-bold text-[#B71C1C] text-center mb-12">
        Available Job Opportunities
      </h2>

      <div className="max-w-5xl mx-auto space-y-8">
        {jobList.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white shadow-md border border-[#E8D8C4] rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h3 className="text-2xl font-semibold text-[#B71C1C]">
                {job.title}
              </h3>
              <p className="text-[#6D2932] mt-2 md:mt-0 font-medium">
                {job.company}
              </p>
            </div>

            <p className="text-[#444] leading-relaxed mb-4">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-[#6D2932] mb-4">
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

            <Link
              href={`/jobs/${job.id}`}
              className="inline-block bg-[#B71C1C] text-white px-6 py-2 rounded-md hover:bg-[#8B0000] transition duration-300 font-medium"
            >
              View Details
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Modal for Apply Form */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-8 max-w-lg w-full"
          >
            <h3 className="text-2xl font-bold text-[#B71C1C] mb-4">
              Apply for {selectedJob.title}
            </h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Application submitted 🎉");
                setSelectedJob(null);
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full border border-[#ccc] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="w-full border border-[#ccc] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
              />
              <div>
                <label className="block mb-1 text-sm font-medium text-[#333]">
                  Upload Your CV <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="w-full border border-[#ccc] rounded px-4 py-2 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#B71C1C] file:text-white file:rounded file:cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="text-sm text-[#B71C1C] underline hover:text-[#8B0000]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B71C1C] text-white px-5 py-2 rounded hover:bg-[#8B0000] transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}

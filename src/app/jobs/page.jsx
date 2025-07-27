"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Inc.",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
    description: "Build modern UIs using React, Tailwind & modern tooling.",
  },
  {
    id: 2,
    title: "AI Research Assistant",
    company: "DeepCore Labs",
    location: "Alexandria, Egypt",
    type: "Internship",
    experience: "Students / Fresh grads",
    description: "Assist in AI research and TensorFlow model training.",
  },
  {
    id: 3,
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    location: "Remote",
    type: "Full-time",
    experience: "1+ year",
    description: "Monitor systems and protect data from threats.",
  },
  // ... كمل باقي الداتا لو عاوز
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // هنا المفروض نبدل بـ fetch من firebase بعدين
    setJobs(jobsData);
  }, []);

  return (
    <section className="min-h-screen bg-[#FFFBF5] py-12 px-4 md:px-12">
      <h2 className="text-4xl font-bold text-[#B71C1C] text-center mb-10">
        Job Opportunities
      </h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-[#E8D8C4] shadow hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
              <h3 className="text-2xl font-semibold text-[#B71C1C]">
                {job.title}
              </h3>
              <span className="text-[#6D2932] mt-2 md:mt-0">{job.company}</span>
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-[#6D2932] mb-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase /> {job.type}
              </div>
              <div className="flex items-center gap-2">
                <FaClock /> {job.experience}
              </div>
            </div>

            <Link
              href={`/jobs/${job.id}`}
              className="inline-block bg-[#B71C1C] text-white px-4 py-2 rounded hover:bg-[#8B0000] transition"
            >
              View Details
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import ApplyModal from "@/components/componentts/ApplyModal";

const jobsData = [
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
];

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const selectedJob = jobsData.find((j) => j.id === Number(id));
    setJob(selectedJob);
  }, [id]);

  if (!job) {
    return <p className="text-center text-red-700 p-10">Job not found.</p>;
  }

  return (
    <section className="min-h-screen bg-[#FFFBF5] py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-[#E8D8C4] shadow">
        <h2 className="text-3xl font-bold text-[#B71C1C] mb-2">{job.title}</h2>
        <p className="text-lg font-medium text-[#6D2932] mb-4">{job.company}</p>

        <div className="flex flex-wrap gap-4 text-sm text-[#6D2932] mb-6">
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

        <p className="text-[#333] leading-relaxed mb-8">{job.description}</p>

        {/* <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#8B0000] transition"
        >
          Apply Now
        </motion.button> */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#8B0000] transition font-semibold"
        >
          Apply Now
        </button>
      </div>
      {showForm && (
        <ApplyModal jobTitle={job.title} onClose={() => setShowForm(false)} />
      )}
    </section>
  );
}

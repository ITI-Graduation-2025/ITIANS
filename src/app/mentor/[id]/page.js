"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// مؤقتا نفس الداتا
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
  const [cvFile, setCvFile] = useState(null);

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

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowForm(true)}
          className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#8B0000] transition"
        >
          Apply Now
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg"
            >
              <h3 className="text-2xl font-bold text-[#B71C1C] mb-4">
                Apply for {job.title}
              </h3>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Application submitted successfully 🎉");
                  setShowForm(false);
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

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
      </AnimatePresence>
    </section>
  );
}

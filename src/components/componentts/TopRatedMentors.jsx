"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export default function TopRatedMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "users"),
          where("role", "==", "mentor"),
          orderBy("createdAt", "desc"),
          limit(3),
        );
        const querySnapshot = await getDocs(q);
        const mentorsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          profileImage: doc.data().profileImage || "/default-avatar.avif",
        }));
        setMentors(mentorsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setError("Failed to load mentors. Please try again later.");
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) {
    return (
      <section className="relative py-16 px-4 overflow-hidden min-h-[500px]">
        {/* Your SVG Background */}
        <div className="absolute inset-0 w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlnssvgjs="http://svgjs.dev/svgjs"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 560"
            className="w-full h-full object-cover"
          >
            <g mask="url(#SvgjsMask1016)" fill="none">
              <rect
                width="1440"
                height="560"
                x="0"
                y="0"
                fill="rgba(144, 27, 32, 1)"
              ></rect>
              <path
                d="M1440 0L1402.57 0L1440 142.41z"
                fill="rgba(255, 255, 255, .1)"
              ></path>
              <path
                d="M1402.57 0L1440 142.41L1440 242.45L943.06 0z"
                fill="rgba(255, 255, 255, .075)"
              ></path>
              <path
                d="M943.06 0L1440 242.45L1440 242.97L390.90999999999997 0z"
                fill="rgba(255, 255, 255, .05)"
              ></path>
              <path
                d="M390.9100000000001 0L1440 242.97L1440 456.35L296.1400000000001 0z"
                fill="rgba(255, 255, 255, .025)"
              ></path>
              <path
                d="M0 560L529.81 560L0 352.84000000000003z"
                fill="rgba(0, 0, 0, .1)"
              ></path>
              <path
                d="M0 352.84000000000003L529.81 560L994.77 560L0 311.23z"
                fill="rgba(0, 0, 0, .075)"
              ></path>
              <path
                d="M0 311.23L994.77 560L1153.31 560L0 221.38000000000002z"
                fill="rgba(0, 0, 0, .05)"
              ></path>
              <path
                d="M0 221.38L1153.31 560L1183.01 560L0 144.98z"
                fill="rgba(0, 0, 0, .025)"
              ></path>
            </g>
            <defs>
              <mask id="SvgjsMask1016">
                <rect width="1440" height="560" fill="#ffffff"></rect>
              </mask>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading mentors...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 px-4 overflow-hidden min-h-[500px]">
        {/* Your SVG Background */}
        <div className="absolute inset-0 w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlnssvgjs="http://svgjs.dev/svgjs"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 560"
            className="w-full h-full object-cover"
          >
            <g mask="url(#SvgjsMask1016)" fill="none">
              <rect
                width="1440"
                height="560"
                x="0"
                y="0"
                fill="rgba(144, 27, 32, 1)"
              ></rect>
              <path
                d="M1440 0L1402.57 0L1440 142.41z"
                fill="rgba(255, 255, 255, .1)"
              ></path>
              <path
                d="M1402.57 0L1440 142.41L1440 242.45L943.06 0z"
                fill="rgba(255, 255, 255, .075)"
              ></path>
              <path
                d="M943.06 0L1440 242.45L1440 242.97L390.90999999999997 0z"
                fill="rgba(255, 255, 255, .05)"
              ></path>
              <path
                d="M390.9100000000001 0L1440 242.97L1440 456.35L296.1400000000001 0z"
                fill="rgba(255, 255, 255, .025)"
              ></path>
              <path
                d="M0 560L529.81 560L0 352.84000000000003z"
                fill="rgba(0, 0, 0, .1)"
              ></path>
              <path
                d="M0 352.84000000000003L529.81 560L994.77 560L0 311.23z"
                fill="rgba(0, 0, 0, .075)"
              ></path>
              <path
                d="M0 311.23L994.77 560L1153.31 560L0 221.38000000000002z"
                fill="rgba(0, 0, 0, .05)"
              ></path>
              <path
                d="M0 221.38L1153.31 560L1183.01 560L0 144.98z"
                fill="rgba(0, 0, 0, .025)"
              ></path>
            </g>
            <defs>
              <mask id="SvgjsMask1016">
                <rect width="1440" height="560" fill="#ffffff"></rect>
              </mask>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <p className="text-white text-center text-lg bg-black/20 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (mentors.length === 0) {
    return (
      <section className="relative py-16 px-4 overflow-hidden min-h-[500px]">
        {/* Your SVG Background */}
        <div className="absolute inset-0 w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlnssvgjs="http://svgjs.dev/svgjs"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1440 560"
            className="w-full h-full object-cover"
          >
            <g mask="url(#SvgjsMask1016)" fill="none">
              <rect
                width="1440"
                height="560"
                x="0"
                y="0"
                fill="rgba(144, 27, 32, 1)"
              ></rect>
              <path
                d="M1440 0L1402.57 0L1440 142.41z"
                fill="rgba(255, 255, 255, .1)"
              ></path>
              <path
                d="M1402.57 0L1440 142.41L1440 242.45L943.06 0z"
                fill="rgba(255, 255, 255, .075)"
              ></path>
              <path
                d="M943.06 0L1440 242.45L1440 242.97L390.90999999999997 0z"
                fill="rgba(255, 255, 255, .05)"
              ></path>
              <path
                d="M390.9100000000001 0L1440 242.97L1440 456.35L296.1400000000001 0z"
                fill="rgba(255, 255, 255, .025)"
              ></path>
              <path
                d="M0 560L529.81 560L0 352.84000000000003z"
                fill="rgba(0, 0, 0, .1)"
              ></path>
              <path
                d="M0 352.84000000000003L529.81 560L994.77 560L0 311.23z"
                fill="rgba(0, 0, 0, .075)"
              ></path>
              <path
                d="M0 311.23L994.77 560L1153.31 560L0 221.38000000000002z"
                fill="rgba(0, 0, 0, .05)"
              ></path>
              <path
                d="M0 221.38L1153.31 560L1183.01 560L0 144.98z"
                fill="rgba(0, 0, 0, .025)"
              ></path>
            </g>
            <defs>
              <mask id="SvgjsMask1016">
                <rect width="1440" height="560" fill="#ffffff"></rect>
              </mask>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <p className="text-white text-center text-lg bg-black/20 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg">
            No mentors found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4 md:px-8 overflow-hidden min-h-[600px]">
      {/* Your SVG Background */}
      {/* <div className="absolute inset-0 w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnssvgjs="http://svgjs.dev/svgjs"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 560"
          className="w-full h-full object-cover"
        >
          <g mask="url(#SvgjsMask1016)" fill="none">
            <rect
              width="1440"
              height="560"
              x="0"
              y="0"
              fill="rgba(144, 27, 32, 1)"
            ></rect>
            <path
              d="M1440 0L1402.57 0L1440 142.41z"
              fill="rgba(255, 255, 255, .1)"
            ></path>
            <path
              d="M1402.57 0L1440 142.41L1440 242.45L943.06 0z"
              fill="rgba(255, 255, 255, .075)"
            ></path>
            <path
              d="M943.06 0L1440 242.45L1440 242.97L390.90999999999997 0z"
              fill="rgba(255, 255, 255, .05)"
            ></path>
            <path
              d="M390.9100000000001 0L1440 242.97L1440 456.35L296.1400000000001 0z"
              fill="rgba(255, 255, 255, .025)"
            ></path>
            <path
              d="M0 560L529.81 560L0 352.84000000000003z"
              fill="rgba(0, 0, 0, .1)"
            ></path>
            <path
              d="M0 352.84000000000003L529.81 560L994.77 560L0 311.23z"
              fill="rgba(0, 0, 0, .075)"
            ></path>
            <path
              d="M0 311.23L994.77 560L1153.31 560L0 221.38000000000002z"
              fill="rgba(0, 0, 0, .05)"
            ></path>
            <path
              d="M0 221.38L1153.31 560L1183.01 560L0 144.98z"
              fill="rgba(0, 0, 0, .025)"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1016">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div> */}
      <div className="absolute inset-0 w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnssvgjs="http://svgjs.dev/svgjs"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 560"
          className="w-full h-full object-cover"
        >
          <g mask="url(#SvgjsMask1009)" fill="none">
            <rect
              width="1440"
              height="560"
              x="0"
              y="0"
              fill="rgba(250, 250, 250, 1)"
            ></rect>
            <path
              d="M0 0L717.27 0L0 279.94z"
              fill="rgba(255, 255, 255, .1)"
            ></path>
            <path
              d="M0 279.94L717.27 0L1028.32 0L0 302.81z"
              fill="rgba(255, 255, 255, .075)"
            ></path>
            <path
              d="M0 302.81L1028.32 0L1082.2 0L0 421.42z"
              fill="rgba(255, 255, 255, .05)"
            ></path>
            <path
              d="M0 421.42L1082.2 0L1334.13 0L0 473.84000000000003z"
              fill="rgba(255, 255, 255, .025)"
            ></path>
            <path
              d="M1440 560L1117.47 560L1440 516.35z"
              fill="rgba(0, 0, 0, .1)"
            ></path>
            <path
              d="M1440 516.35L1117.47 560L1002.32 560L1440 451.48z"
              fill="rgba(0, 0, 0, .075)"
            ></path>
            <path
              d="M1440 451.48L1002.32 560L452.32000000000005 560L1440 376.53000000000003z"
              fill="rgba(0, 0, 0, .05)"
            ></path>
            <path
              d="M1440 376.53L452.32000000000005 560L396.75000000000006 560L1440 130.55999999999997z"
              fill="rgba(0, 0, 0, .025)"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1009">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-[var(--primary)] text-center mb-12"
        >
          Top Mentors
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                y: -5,
                transition: { type: "spring", stiffness: 400 },
              }}
              className="relative group overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20"
            >
              {/* Mentor Image */}
              <div className="relative w-full h-[280px] overflow-hidden rounded-t-2xl">
                <Image
                  src={mentor.profileImage}
                  alt={mentor.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content Section */}
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-[#901B20] mb-2 group-hover:text-[#7A1619] transition-colors duration-300">
                  {mentor.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {mentor.jobTitle || "Professional Mentor"}
                </p>

                {/* View Profile Button */}
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="inline-flex items-center gap-2 bg-[#901B20] text-white px-4 py-2 rounded-full hover:bg-[#7A1619] transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                >
                  <FaEye className="w-4 h-4" />
                  View Profile
                </Link>
              </div>

              {/* Floating Action Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="absolute top-4 right-4"
              >
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="bg-white/90 backdrop-blur-sm text-[#901B20] p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                  title="View Profile"
                  aria-label={`View profile of ${mentor.name}`}
                >
                  <FaEye className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Decorative Element */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#901B20]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

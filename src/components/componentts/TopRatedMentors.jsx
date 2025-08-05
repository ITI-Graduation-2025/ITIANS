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
      <section className="py-16 px-4 bg-[var(--background)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/background.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <p className="text-gray-800 text-center text-lg relative z-10">
          Loading mentors...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-[var(--background)] relative overflow-hidden">
        <div
          className="absolute inset-0  pointer-events-none"
          style={{
            backgroundImage: "url('/background.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <p className="text-gray-800 text-center text-lg relative z-10">
          {error}
        </p>
      </section>
    );
  }

  if (mentors.length === 0) {
    return (
      <section className="py-16 px-4 bg-[var(--background)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/background.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <p className="text-gray-800 text-center text-lg relative z-10">
          No mentors found.
        </p>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-[var(--background)] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-[var(--primary)] text-center mb-12 relative z-10"
      >
        Mentors
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {mentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
              transition: { type: "spring", stiffness: 400 },
            }}
            className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Mentor Image */}
            <div className="relative w-full h-[350px]">
              <Image
                src={mentor.profileImage}
                alt={mentor.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/80 to-transparent flex flex-col justify-end p-6"
            >
              <div className="text-white">
                <h3 className="text-xl md:text-2xl font-semibold mb-1">
                  {mentor.name}
                </h3>
                <p className="text-sm md:text-base opacity-90">
                  {mentor.jobTitle || "Mentor"}
                </p>
              </div>

              {/* View Profile Icon */}
              <div className="absolute top-4 right-4">
                <motion.div
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href={`/mentors/${mentor.id}`}
                    className="text-white bg-[var(--primary)]/30 p-3 rounded-full hover:bg-[var(--primary)]/50 transition"
                    title="View Profile"
                    aria-label={`View profile of ${mentor.name}`}
                  >
                    <FaEye className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

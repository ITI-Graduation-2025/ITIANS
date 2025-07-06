"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

const mentors = [
  {
    id: 1,
    name: "Mahmoud Sameh",
    title: "Frontend Engineer",
    image: "/mentors/mentor2.jpg",
  },
  {
    id: 3,
    name: "Ahmed Nasser",
    title: "Graphic Designer",
    image: "/mentors/mentor3.jpg",
  },
  {
    id: 2,
    name: "Amira Mostafa",
    title: "AI Researcher",
    image: "/mentors/mentor1.jpg",
  },
];

export default function TopRatedMentors() {
  return (
    <section className="py-20 px-4 bg-[#B71C1C]">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
      >
        Top Rated Mentors
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {mentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative group overflow-hidden rounded-2xl shadow-xl"
          >
            {/* Mentor Image */}
            <Image
              src={mentor.image}
              alt={mentor.name}
              width={500}
              height={500}
              className="object-cover w-full h-[500px] transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-10">
              <div className="text-white text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-[#FFEBEE] drop-shadow-sm">
                  {mentor.name}
                </h3>
                <p className="text-base md:text-lg text-[#FCE4EC]">
                  {mentor.title}
                </p>
              </div>

              {/* View Profile Icon */}
              <div className="absolute top-4 right-4">
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition"
                  title="View Profile"
                >
                  <FaEye className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

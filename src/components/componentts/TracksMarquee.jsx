"use client";

import { motion } from "framer-motion";

const tracks = [
  "Web Development",
  "Data Science",
  "AI & Machine Learning",
  "UI/UX Design",
  "Mobile Development",
  "Cybersecurity",
  "DevOps",
  "Business Intelligence",
  "Embedded Systems",
  "Cloud Computing",
];

export default function TracksMarquee() {
  const repeatedTracks = [...tracks, ...tracks, ...tracks];

  return (
    <section className="bg-[#FFFBF5] py-12 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-[#B71C1C] text-center mb-8">
        Graduate Tracks
      </h2>

      {/* Marquee 1 */}
      <div className="overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {repeatedTracks.map((track, index) => (
            <span
              key={`track1-${index}`}
              className="mx-4 px-6 py-2 rounded-full text-base md:text-xl font-medium bg-[#B71C1C] text-white hover:bg-[#7F1D1D] transition duration-300"
            >
              {track}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Marquee 2 */}
      <div className="overflow-hidden mt-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {repeatedTracks.map((track, index) => (
            <span
              key={`track2-${index}`}
              className="mx-4 px-6 py-2 rounded-full text-base md:text-xl font-medium bg-[#B71C1C] text-white hover:bg-[#7F1D1D] transition duration-300"
            >
              {track}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

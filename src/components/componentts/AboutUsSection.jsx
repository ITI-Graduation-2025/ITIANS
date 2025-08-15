"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const typewriterText =
  "A dedicated team of mentors, developers, and leaders ready to guide the next ITI generation.";

function Typewriter({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function AboutUsSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden min-h-screen">
      {/* SVG Background */}
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
          <g mask="url(#SvgjsMask1004)" fill="none">
            <rect
              width="1440"
              height="560"
              x="0"
              y="0"
              fill="rgba(250, 250, 250, 1)"
            ></rect>
            <path
              d="M 0,92 C 57.6,120.4 172.8,234.4 288,234 C 403.2,233.6 460.8,87.8 576,90 C 691.2,92.2 748.8,247.6 864,245 C 979.2,242.4 1036.8,89.2 1152,77 C 1267.2,64.8 1382.4,162.6 1440,184L1440 560L0 560z"
              fill="rgba(220, 220, 220, 1)"
            ></path>
            <path
              d="M 0,446 C 96,421.6 288,314 480,324 C 672,334 768,487.2 960,496 C 1152,504.8 1344,393.6 1440,368L1440 560L0 560z"
              fill="rgba(250, 250, 250, 1)"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1004">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
            Results You Can Measure, Growth You Can Feel
          </h2>
          <p className="text-[#555555] text-lg md:text-xl">
            We help ITI graduates thrive by offering impactful mentorship, real
            opportunities, and a growing network.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">
          {/* Card 1 - top left */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-[var(--primary)]/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
            <p className="uppercase text-sm text-gray-100 mb-3 tracking-widest">
              Professional Team
            </p>
            <motion.p
              className="text-gray-100 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typewriter text={typewriterText} speed={20} />
            </motion.p>
          </motion.div>

          {/* Card 2 - middle image (row-span-2) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group overflow-hidden rounded-xl lg:row-span-2 h-64 lg:h-full shadow-xl border border-white/20"
          >
            <Image
              src="/about/about1.jpg"
              alt="Team collaboration"
              width={500}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-6 flex flex-col justify-end">
              <h3 className="text-white text-3xl font-bold mb-1">73%</h3>
              <p className="text-white text-base uppercase tracking-wider">
                B2B Marketing
              </p>
            </div>
          </motion.div>

          {/* Card 3 - top right image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group overflow-hidden rounded-xl h-64 lg:h-full shadow-xl border border-white/20"
          >
            <Image
              src="/about/about2.jpg"
              alt="Mentorship session"
              width={500}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </motion.div>

          {/* Card 4 - bottom left image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group overflow-hidden rounded-xl h-64 lg:h-full shadow-xl border border-white/20"
          >
            <Image
              src="/about/about3.jpg"
              alt="Business meeting"
              width={500}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </motion.div>

          {/* Card 5 - bottom right text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[var(--primary)]/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-4xl font-bold text-white mb-2">100+</h3>
            <p className="uppercase text-sm text-gray-100 mb-3 tracking-widest">
              Happy Clients
            </p>
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed">
              Collaborations across tech and business to ensure maximum success
              for our graduates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="bg-[var(--background)] py-20 px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-4">
          Results You Can Measure, Growth You Can Feel
        </h2>
        <p className="text-[#561C24] text-lg md:text-xl">
          We help ITI graduates thrive by offering impactful mentorship, real
          opportunities, and a growing network.
        </p>
      </motion.div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 grid-rows-2 gap-6">
        {/* Card 1 - top left */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#B71C1C] rounded-xl p-6 shadow-lg flex flex-col justify-between"
        >
          <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
          <p className="uppercase text-sm text-[#FCE4EC] mb-3 tracking-widest">
            Professional Team
          </p>
          <motion.p
            className="text-[#FFEBEE] text-lg md:text-xl leading-relaxed"
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
          className="relative group overflow-hidden rounded-xl row-span-2"
        >
          <Image
            src="/about/about1.jpg"
            alt="Team collaboration"
            width={500}
            height={600}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 p-6 flex flex-col justify-end">
            <h3 className="text-white text-3xl font-bold mb-1">73%</h3>
            <p className="text-white text-base uppercase">B2B Marketing</p>
          </div>
        </motion.div>

        {/* Card 3 - top right image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group overflow-hidden rounded-xl"
        >
          <Image
            src="/about/about2.jpg"
            alt="Mentorship session"
            width={500}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>

        {/* Card 4 - bottom left image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group overflow-hidden rounded-xl"
        >
          <Image
            src="/about/about3.jpg"
            alt="Business meeting"
            width={500}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>

        {/* Card 5 - bottom right text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#B71C1C] rounded-xl p-6 shadow-lg flex flex-col justify-between"
        >
          <h3 className="text-4xl font-bold text-white mb-2">100+</h3>
          <p className="uppercase text-sm text-[#FCE4EC] mb-3 tracking-widest">
            Happy Clients
          </p>
          <p className="text-[#FFEBEE] text-lg md:text-xl leading-relaxed">
            Collaborations across tech and business to ensure maximum success
            for our graduates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

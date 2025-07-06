"use client";

import { motion } from "framer-motion";

const companies = [
  "CodeCraft",
  "DesignLab",
  "DataBridge",
  "AgileWorks",
  "Apple",
  "Microsoft",
];

export default function CompaniesTicker() {
  return (
    <section className="py-12 px-4 bg-[#FFFBF5]">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-[#B71C1C] text-center mb-8"
      >
        Our Partner Companies
      </motion.h2>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap"
        >
          {[...companies, ...companies].map((company, index) => (
            <span
              key={index}
              className="inline-block mx-8 text-2xl font-semibold text-[#B71C1C] hover:text-[#E57373] transition-colors duration-200"
            >
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

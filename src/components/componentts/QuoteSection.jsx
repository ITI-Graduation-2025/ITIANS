"use client";

import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="bg-[#B71C1C] py-28 px-6 flex items-center justify-center text-center">
      <motion.blockquote
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-white text-4xl md:text-5xl font-bold leading-snug tracking-wide"
      >
        "You bring the passion. We bring the tools, the mentors, and the
        support. Let’s build something extraordinary — together."
      </motion.blockquote>
    </section>
  );
}

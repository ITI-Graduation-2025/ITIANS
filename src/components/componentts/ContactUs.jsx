"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <section
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="560" preserveAspectRatio="none" viewBox="0 0 1440 560">
            <g mask="url(&quot;#SvgjsMask1000&quot;)" fill="none">
                <rect width="1440" height="560" x="0" y="0" fill="rgba(250, 250, 250, 1)"></rect>
                <path d="M0 0L717.27 0L0 279.94z" fill="rgba(255, 255, 255, .1)"></path>
                <path d="M0 279.94L717.27 0L1028.32 0L0 302.81z" fill="rgba(255, 255, 255, .075)"></path>
                <path d="M0 302.81L1028.32 0L1082.2 0L0 421.42z" fill="rgba(255, 255, 255, .05)"></path>
                <path d="M0 421.42L1082.2 0L1334.13 0L0 473.84000000000003z" fill="rgba(255, 255, 255, .025)"></path>
                <path d="M1440 560L1117.47 560L1440 516.35z" fill="rgba(0, 0, 0, .1)"></path>
                <path d="M1440 516.35L1117.47 560L1002.32 560L1440 451.48z" fill="rgba(0, 0, 0, .075)"></path>
                <path d="M1440 451.48L1002.32 560L452.32000000000005 560L1440 376.53000000000003z" fill="rgba(0, 0, 0, .05)"></path>
                <path d="M1440 376.53L452.32000000000005 560L396.75000000000006 560L1440 130.55999999999997z" fill="rgba(0, 0, 0, .025)"></path>
            </g>
            <defs>
                <mask id="SvgjsMask1000">
                    <rect width="1440" height="560" fill="#ffffff"></rect>
                </mask>
            </defs>
          </svg>`,
        )}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-gradient-to-br from-[#901b20] via-[#7a1519] to-[#5c0f12] rounded-2xl shadow-2xl border border-[#901b20]/30 backdrop-blur-sm px-8 py-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl font-bold text-[#fafafa] mb-2"
            >
              Contact Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[#fafafa]/80 text-sm"
            >
              Get in touch with us today
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 bg-[#fafafa]/10 border border-[#fafafa]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fafafa]/60 focus:border-transparent placeholder:text-[#fafafa]/60 text-[#fafafa] transition-all duration-300 hover:bg-[#fafafa]/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 bg-[#fafafa]/10 border border-[#fafafa]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fafafa]/60 focus:border-transparent placeholder:text-[#fafafa]/60 text-[#fafafa] transition-all duration-300 hover:bg-[#fafafa]/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-4 bg-[#fafafa]/10 border border-[#fafafa]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fafafa]/60 focus:border-transparent placeholder:text-[#fafafa]/60 text-[#fafafa] transition-all duration-300 hover:bg-[#fafafa]/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <textarea
                rows={4}
                placeholder="Your message"
                className="w-full p-4 bg-[#fafafa]/10 border border-[#fafafa]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fafafa]/60 focus:border-transparent placeholder:text-[#fafafa]/60 text-[#fafafa] resize-none transition-all duration-300 hover:bg-[#fafafa]/20"
              />
            </motion.div>

            <motion.div
              className="flex items-center space-x-3 text-[#fafafa]/80 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="checkbox"
                id="privacy"
                className="w-4 h-4 accent-[#fafafa] rounded focus:ring-[#fafafa]/60"
              />
              <label htmlFor="privacy" className="cursor-pointer">
                I agree to the privacy policy
              </label>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(250, 250, 250, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#fafafa] to-[#f5f5f5] hover:from-[#f0f0f0] hover:to-[#e8e8e8] text-[var(--primary)] font-semibold py-3 rounded-xl transition-all duration-300 text-lg shadow-lg"
            >
              Send Message
            </motion.button>
          </motion.form>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex justify-center mt-6"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-[#fafafa]/60 to-[#fafafa]/80 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

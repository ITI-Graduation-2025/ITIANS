// src/components/ContactUs.jsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <section className="min-h-screen flex py-16 bg-[var(--background)]">
      {/* Left Side - Image Only */}
      <div className="w-1/2 relative">
        <Image
          src="/images/contact-left.jpg"
          alt="Contact background"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-1/2 bg-[#FFFBF5] flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#B71C1C] rounded-xl shadow-xl px-12 py-8 w-full max-w-xl"
        >
          <h2 className="text-3xl font-bold text-[#FFFBF5] mb-6 text-center">
            Contact Us
          </h2>
          <form className="space-y-5 font-medium">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 bg-transparent border border-[#F6E9D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E9D7] placeholder:text-[#F6E9D7] text-[#FFFBF5]"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 bg-transparent border border-[#F6E9D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E9D7] placeholder:text-[#F6E9D7] text-[#FFFBF5]"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 bg-transparent border border-[#F6E9D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E9D7] placeholder:text-[#F6E9D7] text-[#FFFBF5]"
            />
            <textarea
              rows={4}
              placeholder="Your message"
              className="w-full p-3 bg-transparent border border-[#F6E9D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E9D7] placeholder:text-[#F6E9D7] text-[#FFFBF5]"
            />
            <div className="flex items-center space-x-2 text-[#F6E9D7] text-sm">
              <input
                type="checkbox"
                id="privacy"
                className="accent-[#F6E9D7]"
              />
              <label htmlFor="privacy">I agree to the privacy policy</label>
            </div>

            {/* Submit Button with animation */}
            <motion.button
              type="submit"
              whileTap={{ scale: 1.05 }}
              className="w-full bg-[#F6E9D7] hover:bg-[#FFFBF5] text-[#B71C1C] font-semibold py-3 rounded-lg transition duration-300"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

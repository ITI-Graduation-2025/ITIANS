"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaUsers, FaTasks, FaHandshake } from "react-icons/fa";

const stats = [
  {
    number: 100000,
    prefix: "+",
    description: "Registered users benefiting from our services.",
    icon: <FaUsers className="text-3xl text-[#B71C1C] mb-4" />,
  },
  {
    number: 65000,
    prefix: "+",
    description: "Successful projects delivered worldwide.",
    icon: <FaTasks className="text-3xl text-[#B71C1C] mb-4" />,
  },
  {
    number: 2000,
    prefix: "+",
    description: "Collaborations and strategic partnerships.",
    icon: <FaHandshake className="text-3xl text-[#B71C1C] mb-4" />,
  },
];

export default function OurImpactSection() {
  return (
    <section className="bg-[#B71C1C] py-20 px-4">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
      >
        Our Impact
      </motion.h2>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#FFFBF5] border border-[#E8D8C4] rounded-2xl text-center p-8 shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
          >
            {/* Icon */}
            <div className="flex justify-center">{item.icon}</div>

            {/* Number */}
            <h3 className="text-4xl md:text-5xl font-bold text-[#B71C1C] mb-4">
              <CountUp
                end={item.number}
                duration={2}
                separator=","
                prefix={item.prefix}
              />
            </h3>

            {/* Description */}
            <p className="text-[#6D2932] text-sm leading-relaxed max-w-xs mx-auto">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

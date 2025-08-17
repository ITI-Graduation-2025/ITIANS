"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaUsers, FaTasks, FaHandshake } from "react-icons/fa";

const stats = [
  {
    number: 100000,
    prefix: "+",
    description: "Registered users benefiting from our services.",
    icon: <FaUsers className="text-3xl text-[var(--primary)] mb-4" />,
  },
  {
    number: 65000,
    prefix: "+",
    description: "Successful projects delivered worldwide.",
    icon: <FaTasks className="text-3xl text-[var(--primary)] mb-4" />,
  },
  {
    number: 2000,
    prefix: "+",
    description: "Collaborations and strategic partnerships.",
    icon: <FaHandshake className="text-3xl text-[var(--primary)] mb-4" />,
  },
];

export default function OurImpactSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
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
          <g mask="url(#SvgjsMask1009)" fill="none">
            <rect
              width="1440"
              height="560"
              x="0"
              y="0"
              fill="rgba(250, 250, 250, 1)"
            ></rect>
            <path
              d="M0 0L717.27 0L0 279.94z"
              fill="rgba(255, 255, 255, .1)"
            ></path>
            <path
              d="M0 279.94L717.27 0L1028.32 0L0 302.81z"
              fill="rgba(255, 255, 255, .075)"
            ></path>
            <path
              d="M0 302.81L1028.32 0L1082.2 0L0 421.42z"
              fill="rgba(255, 255, 255, .05)"
            ></path>
            <path
              d="M0 421.42L1082.2 0L1334.13 0L0 473.84000000000003z"
              fill="rgba(255, 255, 255, .025)"
            ></path>
            <path
              d="M1440 560L1117.47 560L1440 516.35z"
              fill="rgba(0, 0, 0, .1)"
            ></path>
            <path
              d="M1440 516.35L1117.47 560L1002.32 560L1440 451.48z"
              fill="rgba(0, 0, 0, .075)"
            ></path>
            <path
              d="M1440 451.48L1002.32 560L452.32000000000005 560L1440 376.53000000000003z"
              fill="rgba(0, 0, 0, .05)"
            ></path>
            <path
              d="M1440 376.53L452.32000000000005 560L396.75000000000006 560L1440 130.55999999999997z"
              fill="rgba(0, 0, 0, .025)"
            ></path>
          </g>
          <defs>
            <mask id="SvgjsMask1009">
              <rect width="1440" height="560" fill="#ffffff"></rect>
            </mask>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-[var(--primary)] mb-12"
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
              className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-center p-8 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 hover:bg-white/95"
            >
              {/* Icon */}
              <div className="flex justify-center">{item.icon}</div>

              {/* Number */}
              <h3 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
                <CountUp
                  end={item.number}
                  duration={2}
                  separator=","
                  prefix={item.prefix}
                />
              </h3>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaBrain,
  FaNetworkWired,
  FaShieldAlt,
  FaCode,
  FaGlobe,
  FaMobileAlt,
  FaMicrochip,
  FaImage,
  FaChartBar,
} from "react-icons/fa";

const jobs = [
  {
    id: 1,
    title: "Artificial Intelligence (AI) & Machine Learning (ML)",
    description: "Explore AI and ML innovations to solve complex problems.",
    icon: <FaBrain />,
  },
  {
    id: 2,
    title: "Networking & Communication",
    description: "Master network design and communication protocols.",
    icon: <FaNetworkWired />,
  },
  {
    id: 3,
    title: "Cybersecurity & Cryptography",
    description: "Protect systems with advanced security techniques.",
    icon: <FaShieldAlt />,
  },
  {
    id: 4,
    title: "Software Engineering",
    description: "Develop robust software solutions with best practices.",
    icon: <FaCode />,
  },
  {
    id: 5,
    title: "Web Development",
    description: "Build dynamic and responsive web applications.",
    icon: <FaGlobe />,
  },
  {
    id: 6,
    title: "Mobile Development",
    description: "Create cutting-edge mobile apps for all platforms.",
    icon: <FaMobileAlt />,
  },
  {
    id: 7,
    title: "Computer Architecture & Organization",
    description: "Design and optimize computer systems and hardware.",
    icon: <FaMicrochip />,
  },
  {
    id: 8,
    title: "Graphics & Multimedia",
    description: "Craft stunning visuals and multimedia content.",
    icon: <FaImage />,
  },
  {
    id: 9,
    title: "Data Science & Analytics",
    description: "Analyze data to drive insightful business decisions.",
    icon: <FaChartBar />,
  },
];

export default function JobsSection() {
  return (
    <section className="py-20 px-4 bg-[#fffbf5]">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-[#B71C1C] text-center mb-12"
      >
        Job Opportunities
      </motion.h2>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="relative"
      >
        {jobs.map((job, index) => (
          <SwiperSlide key={job.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 16px rgba(183, 28, 28, 0.2)",
                backgroundColor: "#fff",
              }}
              className="bg-[#fcf6f6] shadow-md p-6 rounded-2xl flex flex-col justify-between text-center transition-all duration-300 w-[420px] min-h-[230px] max-h-[230px]"
            >
              {/* Icon and Title */}
              <div className="flex items-center justify-center gap-2 mb-4 w-full text-center">
                <div className="text-2xl text-[#B71C1C]">{job.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold text-[#B71C1C] text-left truncate text-center">
                  {job.title}
                </h3>
              </div>

              {/* Description and Link */}
              <div className="flex flex-col justify-between flex-grow">
                <p className="text-black text-lg mb-6">{job.description}</p>

                <Link
                  href={`/jobs/${job.id}`}
                  className="text-[#B71C1C] text-base md:text-lg font-semibold hover:underline mt-auto"
                >
                  Learn More &gt;
                </Link>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #b71c1c;
          scale: 0.6;
          transition: color 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #e57373;
        }

        .swiper-pagination {
          bottom: -30px !important;
        }

        .swiper-pagination-bullet {
          background: #b71c1c;
          opacity: 0.4;
        }

        .swiper-pagination-bullet-active {
          background: #e57373;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}

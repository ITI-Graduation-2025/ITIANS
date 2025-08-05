"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function JobsSection() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(
        collection(db, "jobs"),
        orderBy("createdAt", "desc"),
        limit(5),
      );
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setJobs(jobsData);
    };

    const fetchCompanyUsers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "company"));
      const querySnapshot = await getDocs(q);
      const companyUsers = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        companyUsers[data.name || data.email] =
          data.profileImage || "/default-logo.avif";
      });
      setUsers(companyUsers);
    };

    fetchJobs();
    fetchCompanyUsers();
  }, []);

  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return "";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const getCardColor = (index) => {
    const colors = [
      "bg-[#f5f5f5]",
      "bg-[#f5f5f5]",
      "bg-[#f5f5f5]",
      "bg-[#f5f5f5]",
      "bg-[#f5f5f5]",
      "bg-[#f5f5f5]",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-[#fafafa]">
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
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="relative"
        aria-label="Job opportunities carousel"
      >
        {jobs.map((job, index) => (
          <SwiperSlide key={job.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                transition: { type: "spring", stiffness: 300 },
              }}
              className="w-full max-w-sm h-auto overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white p-1 mx-auto"
            >
              <div
                className={`p-4 ${getCardColor(index)} mx-2 my-2 rounded-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="bg-white w-fit px-3 py-1 rounded-full shadow-sm mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-3">
                      {job.company.charAt(0).toUpperCase() +
                        job.company.slice(1)}
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-600 description mb-3">
                      {job.description || "No description available"}...
                    </p>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
                        {job.type || "N/A"}
                      </span>
                      <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
                        {job.level || "N/A"}
                      </span>
                    </div>
                  </div>
                  <motion.img
                    src={users[job.company] || "/default-logo.avif"}
                    alt={`${job.company} logo`}
                    className="w-15 h-15 rounded-full object-cover"
                    onError={(e) => (e.target.src = "/default-logo.avif")}
                    whileHover={{
                      rotate: 10,
                      transition: { type: "spring", stiffness: 200 },
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      ${job.salary || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-[#B71C1C]" />
                      {job.location || "N/A"}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={`/jobs/${job.id}`}
                      className="bg-[#B71C1C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7e1e22] transition"
                      aria-label={`View details for ${job.title} at ${job.company}`}
                    >
                      Details
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev" aria-label="Previous slide"></div>
        <div className="swiper-button-next" aria-label="Next slide"></div>
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #b71c1c;
          scale: 0.7;
          transition:
            color 0.3s ease,
            transform 0.2s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #e57373;
          transform: scale(1.1);
        }

        .swiper-pagination {
          bottom: -40px !important;
        }

        .swiper-pagination-bullet {
          background: #b71c1c;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #b71c1c;
          opacity: 1;
          scale: 1.2;
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .description {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 1.5em;
        }
      `}</style>
    </section>
  );
}

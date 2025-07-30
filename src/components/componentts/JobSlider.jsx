"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function JobsSection() {
  const [jobs, setJobs] = useState([]);

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
      }));
      setJobs(jobsData);
    };

    fetchJobs();
  }, []);

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
              <div className="flex flex-col justify-between flex-grow">
                <h3 className="text-xl md:text-2xl font-bold text-[#B71C1C] text-center mb-4">
                  {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
                </h3>
                <p className="text-gray-600 text-md mb-4">{job.company}</p>
                <p className="text-black text-lg mb-6 line-clamp-2">
                  {job.description}
                </p>

                <Link
                  href={`/jobs/${job.id}`}
                  className="text-[#B71C1C] text-base md:text-lg font-semibold hover:underline mt-auto"
                >
                  Read More &gt;
                </Link>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limits to 2 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </section>
  );
}

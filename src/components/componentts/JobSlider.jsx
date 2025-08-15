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
    <section className="py-16 px-4 md:px-8 bg-[var(--background)]">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-[var(--primary)] text-center mb-12"
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
                      <FaMapMarkerAlt className="mr-1 text-[var(--primary)]" />
                      {job.location || "N/A"}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={`/jobs/${job.id}`}
                      className="bg-[var(--primary)] text-gray-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition"
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
///////////////////

// "use client";

// import { CardCarousel } from "@/components/ui/card-carousel";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useEffect, useState, useCallback } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   limit,
//   where,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { FaMapMarkerAlt } from "react-icons/fa";

// export default function JobsSection() {
//   const [jobs, setJobs] = useState([]);
//   const [users, setUsers] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   const getCardColor = useCallback((index) => {
//     const colors = ["bg-[#f5f5f5]", "bg-[#e3f2fd]", "bg-[#fce4ec]"];
//     return colors[index % colors.length];
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [jobsSnapshot, usersSnapshot] = await Promise.all([
//           getDocs(
//             query(
//               collection(db, "jobs"),
//               orderBy("createdAt", "desc"),
//               limit(5),
//             ),
//           ),
//           getDocs(
//             query(collection(db, "users"), where("role", "==", "company")),
//           ),
//         ]);

//         const jobsData = jobsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//           createdAt: doc.data().createdAt?.toDate(),
//         }));

//         const companyUsers = {};
//         usersSnapshot.forEach((doc) => {
//           const data = doc.data();
//           companyUsers[data.name || data.email] =
//             data.profileImage || "/default-logo.avif";
//         });

//         setJobs(jobsData);
//         setUsers(companyUsers);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatDate = (date) => {
//     if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "N/A";
//     const day = date.getDate();
//     const month = date.toLocaleString("en-US", { month: "short" });
//     const year = date.getFullYear();
//     return `${day} ${month}, ${year}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-16">
//         <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (jobs.length === 0) {
//     return (
//       <div className="text-center py-16">No job opportunities available.</div>
//     );
//   }

//   const jobCards = jobs.map((job, index) => ({
//     content: (
//       <motion.div
//         key={job.id}
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: index * 0.2 }}
//         className="w-full max-w-sm h-auto overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white p-1 mx-auto"
//       >
//         <div className={`p-4 ${getCardColor(index)} mx-2 my-2 rounded-xl`}>
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="bg-white w-fit px-3 py-1 rounded-full shadow-sm mb-4">
//                 <span className="text-sm font-medium text-gray-700">
//                   {formatDate(job.createdAt)}
//                 </span>
//               </div>
//               <p className="text-lg font-medium text-gray-700 mb-3">
//                 {job.company.charAt(0).toUpperCase() + job.company.slice(1)}
//               </p>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-3">
//                 {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
//               </h3>
//               <p className="text-sm text-gray-600 description mb-3">
//                 {job.description || "No description available"}...
//               </p>
//               <div className="flex gap-2 text-sm text-gray-600">
//                 <span className="px-2 py-1 border border-gray-300 rounded-full">
//                   {job.type || "N/A"}
//                 </span>
//                 <span className="px-2 py-1 border border-gray-300 rounded-full">
//                   {job.level || "N/A"}
//                 </span>
//               </div>
//             </div>
//             <motion.img
//               src={users[job.company] || "/default-logo.avif"}
//               alt={`${job.company} logo`}
//               className="w-16 h-16 rounded-full object-cover"
//               onError={(e) => (e.target.src = "/default-logo.avif")}
//               whileHover={{
//                 rotate: 10,
//                 transition: { type: "spring", stiffness: 200 },
//               }}
//             />
//           </div>
//         </div>
//         <div className="p-4 bg-white">
//           <div className="flex justify-between items-center space-x-4">
//             <div>
//               <p className="text-sm font-medium text-gray-800 mb-1">
//                 ${job.salary || "N/A"}
//               </p>
//               <p className="text-sm text-gray-600 flex items-center">
//                 <FaMapMarkerAlt className="mr-1 text-[var(--primary)]" />
//                 {job.location || "N/A"}
//               </p>
//             </div>
//             <Link
//               href={`/jobs/${job.id}`}
//               className="bg-[var(--primary)] text-gray-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition"
//             >
//               Details
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     ),
//   }));

//   return (
//     <section className="relative py-16 px-4 md:px-8 bg-[var(--background)]">
//       {/* خلفية SVG */}
//       <div className="absolute inset-0 -z-10 opacity-30">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           preserveAspectRatio="none"
//           viewBox="0 0 800 400"
//           className="w-full h-full"
//         >
//           <circle cx="200" cy="200" r="300" fill="#e3f2fd" />
//           <circle cx="600" cy="300" r="250" fill="#fce4ec" />
//         </svg>
//       </div>

//       <motion.h2
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl md:text-4xl font-bold text-[var(--primary)] text-center mb-12"
//       >
//         Job Opportunities
//       </motion.h2>

//       <CardCarousel
//         items={jobCards}
//         autoplayDelay={4000}
//         showPagination={true}
//         showNavigation={true}
//       />

//       <style jsx global>{`
//         .description {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//       `}</style>
//     </section>
//   );
// }

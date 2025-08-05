// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
// import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
// import { db } from "@/config/firebase";

// export default function JobsPage() {
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [users, setUsers] = useState({});
//   const jobsPerPage = 6;

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
//       const querySnapshot = await getDocs(q);
//       const jobsData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate(), // تحويل Timestamp لـ Date
//       }));
//       setJobs(jobsData);
//       setFilteredJobs(jobsData);
//     };

//     const fetchCompanyUsers = async () => {
//       const q = query(collection(db, "users"), where("role", "==", "company"));
//       const querySnapshot = await getDocs(q);
//       const companyUsers = {};
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         companyUsers[data.name || data.email] =
//           data.profileImage || "/default-logo.avif";
//       });
//       setUsers(companyUsers);
//     };

//     fetchJobs();
//     fetchCompanyUsers();
//   }, []);

//   const formatDate = (date) => {
//     if (!date || isNaN(date.getTime())) return "";
//     const day = date.getDate();
//     const month = date.toLocaleString("en-US", { month: "short" });
//     const year = date.getFullYear();
//     return `${day} ${month}, ${year}`;
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     const filtered = jobs.filter(
//       (job) =>
//         job.title.toLowerCase().includes(term) ||
//         (job.company && job.company.toLowerCase().includes(term)),
//     );
//     setFilteredJobs(filtered);
//     setCurrentPage(1);
//   };

//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
//   const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const getPaginationNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 3;
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage < maxVisiblePages - 1 && startPage > 1) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const getCardColor = (index) => {
//     const colors = [
//       "bg-[#FFF5E4]",
//       "bg-[#EEFBFA]",
//       "bg-[#FCEEEF]",
//       "bg-[#EBFFEB]",
//       "bg-[#FEE3E5]",
//       "bg-[#DFF1EE]",
//     ];
//     return colors[index % colors.length];
//   };

//   return (
//     <section className="min-h-screen bg-[var(--background)] py-12 px-4 md:px-12">
//       <h2 className="text-4xl font-bold text-[var(--primary)] text-center mb-10">
//         Job Opportunities
//       </h2>

//       <div className="mb-6 flex justify-center">
//         <div className="relative w-full md:w-1/2">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearch}
//             placeholder="Search jobs by title or company..."
//             className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
//           />
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
//         {currentJobs.map((job, i) => (
//           <motion.div
//             key={job.id}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: i * 0.1 }}
//             className="w-full max-w-sm h-auto overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white p-1"
//           >
//             <div className={`p-4 ${getCardColor(i)} mx-2 my-2 rounded-xl`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="bg-white w-fit px-3 py-1 rounded-full shadow-sm mb-4">
//                     <span className="text-sm font-medium text-gray-700">
//                       {formatDate(job.createdAt)}
//                     </span>
//                   </div>
//                   <p className="text-lg font-medium text-gray-700 mb-3">
//                     {/* {job.company} */}
//                     {job.company.charAt(0).toUpperCase() + job.company.slice(1)}
//                   </p>
//                   <h3 className="text-2xl font-semibold text-gray-800 mb-7">
//                     {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
//                   </h3>
//                   <div className="flex gap-2 text-sm text-gray-600 mb-3">
//                     <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
//                       {job.type || "N/A"}
//                     </span>
//                     <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
//                       {job.level || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//                 <img
//                   src={users[job.company] || "/default-logo.avif"}
//                   alt={`${job.company} logo`}
//                   className="w-15 h-15 rounded-full object-cover"
//                   onError={(e) => {
//                     e.target.src = "/default-logo.avif";
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="p-4 bg-white">
//               <div className="flex justify-between items-center space-x-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800 mb-1">
//                     ${job.salary || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600 flex items-center">
//                     <FaMapMarkerAlt className="mr-1" /> {job.location || "N/A"}
//                   </p>
//                 </div>
//                 <Link
//                   href={`/jobs/${job.id}`}
//                   className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7e1e22] transition"
//                 >
//                   Details
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="mt-6 flex justify-center gap-2 items-center">
//         <button
//           onClick={handlePrev}
//           className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
//           disabled={currentPage === 1}
//         >
//           Prev
//         </button>
//         {getPaginationNumbers().map((number) => (
//           <button
//             key={number}
//             onClick={() => paginate(number)}
//             className={`px-3 py-1 rounded ${currentPage === number ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"} hover:bg-gray-300`}
//           >
//             {number}
//           </button>
//         ))}
//         <button
//           onClick={handleNext}
//           className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </section>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState({});
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // تحويل Timestamp لـ Date
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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1 && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getCardColor = (index) => {
    const colors = [
      "bg-[#FFF5E4]",
      "bg-[#EEFBFA]",
      "bg-[#FCEEEF]",
      "bg-[#EBFFEB]",
      "bg-[#FEE3E5]",
      "bg-[#DFF1EE]",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="min-h-screen bg-[var(--background)] py-12 px-4 md:px-12">
      <h2 className="text-4xl font-bold text-[var(--primary)] text-center mb-10">
        Job Opportunities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
        {currentJobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="w-full max-w-sm h-auto overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white p-1"
          >
            <div className={`p-4 ${getCardColor(i)} mx-2 my-2 rounded-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="bg-white w-fit px-3 py-1 rounded-full shadow-sm mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-3">
                    {/* {job.company} */}
                    {job.company.charAt(0).toUpperCase() + job.company.slice(1)}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-7">
                    {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
                  </h3>
                  <div className="flex gap-2 text-sm text-gray-600 mb-3">
                    <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
                      {job.type || "N/A"}
                    </span>
                    <span className="px-2 py-1 border border-gray-300 rounded-full bg-transparent">
                      {job.level || "N/A"}
                    </span>
                  </div>
                </div>
                <img
                  src={users[job.company] || "/default-logo.avif"}
                  alt={`${job.company} logo`}
                  className="w-15 h-15 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-logo.avif";
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
                    <FaMapMarkerAlt className="mr-1" /> {job.location || "N/A"}
                  </p>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7e1e22] transition"
                >
                  Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2 items-center">
        <button
          onClick={handlePrev}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {getPaginationNumbers().map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded ${currentPage === number ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"} hover:bg-gray-300`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNext}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

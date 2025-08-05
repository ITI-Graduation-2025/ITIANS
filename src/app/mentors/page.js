// "use client";

// import React, { useEffect, useState } from "react";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import Link from "next/link";
// import { db } from "@/config/firebase";

// export default function MentorsPage() {
//   const [mentors, setMentors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOrder, setSortOrder] = useState("None");
//   const [currentPage, setCurrentPage] = useState(1);
//   const mentorsPerPage = 6;

//   useEffect(() => {
//     fetchMentors();
//   }, []);

//   const fetchMentors = async () => {
//     try {
//       const q = query(collection(db, "users"), where("role", "==", "mentor"));
//       const querySnapshot = await getDocs(q);
//       const mentorsData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMentors(mentorsData);
//     } catch (error) {
//       console.error("Error fetching mentors:", error);
//     }
//   };

//   // Search + Sort Logic
//   const filteredMentors = mentors
//     .filter((mentor) =>
//       mentor.name.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     .sort((a, b) => {
//       if (sortOrder === "HighToLow") {
//         return (b.rating || 0) - (a.rating || 0);
//       } else if (sortOrder === "LowToHigh") {
//         return (a.rating || 0) - (b.rating || 0);
//       }
//       return 0; // No sorting
//     });

//   const indexOfLastMentor = currentPage * mentorsPerPage;
//   const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
//   const currentMentors = filteredMentors.slice(
//     indexOfFirstMentor,
//     indexOfLastMentor,
//   );

//   const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);

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

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-[#B71C1C] text-center">
//         Our Mentors
//       </h1>

//       {/* Search + Sort Bar */}
//       <div className="bg-[#B71C1C] p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//         <input
//           type="text"
//           placeholder="Search by mentor name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-1/2 px-4 py-2 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E57373] transition duration-300"
//         />

//         <select
//           value={sortOrder}
//           onChange={(e) => {
//             setSortOrder(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-full sm:w-1/4 px-4 py-2 rounded bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#E57373] transition duration-300"
//         >
//           <option value="None">Sort by Rating</option>
//           <option value="HighToLow">High to Low</option>
//           <option value="LowToHigh">Low to High</option>
//         </select>
//       </div>

//       {/* Mentors Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {currentMentors.map((mentor, index) => (
//           <Link
//             key={mentor.id}
//             href={`/mentor/${mentor.id}`}
//             className="bg-[#E0E0E0] text-[#B71C1C] rounded-xl p-5 shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 animate-fade-in"
//             style={{
//               animationDelay: `${index * 100}ms`,
//               animationFillMode: "both",
//             }}
//           >
//             <div className="flex flex-col items-center text-center">
//               <img
//                 src={mentor.profileImage || "/default-avatar.avif"}
//                 alt={mentor.name}
//                 className="w-24 h-24 rounded-full object-cover mb-4"
//               />
//               <h2 className="text-xl font-semibold">{mentor.name}</h2>
//               <p className="text-[#B71C1C] text-sm mt-1">
//                 {mentor.description || "No description available."}
//               </p>
//               <p className="text-xs text-[#B71C1C] mt-2">
//                 Rating: {mentor.rating || "Not rated yet"}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-8 space-x-2 items-center">
//           <button
//             onClick={handlePrev}
//             className="px-3 py-1 rounded bg-gray-200 text-[#B71C1C] hover:bg-gray-300 disabled:opacity-50"
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>
//           {getPaginationNumbers().map((number) => (
//             <button
//               key={number}
//               onClick={() => handlePageChange(number)}
//               className={`px-3 py-1 rounded ${currentPage === number ? "bg-[#B71C1C] text-white" : "bg-gray-200 text-[#B71C1C] border border-[#B71C1C]"} hover:bg-gray-300`}
//             >
//               {number}
//             </button>
//           ))}
//           <button
//             onClick={handleNext}
//             className="px-3 py-1 rounded bg-gray-200 text-[#B71C1C] hover:bg-gray-300 disabled:opacity-50"
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Animations CSS */}
//       <style jsx>{`
//         .animate-fade-in {
//           opacity: 0;
//           transform: scale(0.95);
//           animation: fadeInScale 0.5s forwards;
//         }

//         @keyframes fadeInScale {
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
/////////////////////////////
"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/config/firebase";
import { Linkedin, Github, User, Calendar } from "lucide-react";

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [sortOrder, setSortOrder] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 6;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "mentor"));
      const querySnapshot = await getDocs(q);
      const mentorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentors(mentorsData);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  // Sort Logic
  const sortedMentors = mentors.sort((a, b) => {
    if (sortOrder === "HighToLow") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortOrder === "LowToHigh") {
      return (a.rating || 0) - (b.rating || 0);
    }
    return 0; // No sorting
  });

  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = sortedMentors.slice(
    indexOfFirstMentor,
    indexOfLastMentor,
  );

  const totalPages = Math.ceil(sortedMentors.length / mentorsPerPage);

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

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const formatExperience = (years, months) => {
    if (!years && !months) return "New to mentoring";

    let exp = "";
    if (years) exp += `${years} year${years > 1 ? "s" : ""}`;
    if (years && months) exp += " ";
    if (months) exp += `${months} month${months > 1 ? "s" : ""}`;

    return exp + " experience";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-12 text-[var(--primary)] text-center">
        Our Mentors
      </h1>

      {/* Sort Bar */}
      {/* <div className="flex justify-center mb-8">
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
        >
          <option value="None">Sort by Rating</option>
          <option value="HighToLow">High to Low</option>
          <option value="LowToHigh">Low to High</option>
        </select>
      </div> */}

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8">
        {currentMentors.map((mentor, index) => (
          <div
            key={mentor.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-gray-100"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            {/* Profile Image */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-transparent overflow-hidden">
                <img
                  src={mentor.profileImage || "/default-avatar.avif"}
                  alt={mentor.name}
                  className="w-full h-full object-cover hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
              {mentor.name}
            </h2>

            {/* Job Title */}
            <p className="text-gray-600 text-sm font-medium mb-4 tracking-wider uppercase">
              {mentor.jobTitle || "Mentor"}
            </p>

            {/* Experience */}
            <div className="flex items-center justify-center mb-4 text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {formatExperience(
                  mentor.experienceYears,
                  mentor.experienceMonths,
                )}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-3 mb-6">
              {mentor.linkedIn && (
                <a
                  href={mentor.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-300"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {mentor.github && (
                <a
                  href={mentor.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition-all duration-300"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Rating */}
            {mentor.rating && (
              <div className="mb-6">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-gray-700 ml-1">{mentor.rating}</span>
              </div>
            )}

            {/* View Profile Button */}
            <Link href={`/mentor/${mentor.id}`}>
              <button className="bg-[var(--primary)] hover:bg-opacity-80 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 mx-auto">
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mentors found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2 items-center">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {getPaginationNumbers().map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === number
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

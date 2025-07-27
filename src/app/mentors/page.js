"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/config/firebase";

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 9;

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

  // Search + Sort Logic
  const filteredMentors = mentors
    .filter((mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "HighToLow") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOrder === "LowToHigh") {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0; // No sorting
    });

  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = filteredMentors.slice(
    indexOfFirstMentor,
    indexOfLastMentor,
  );

  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#B71C1C] text-center">
        Our Mentors
      </h1>

      {/* Search + Sort Bar */}
      <div className="bg-[#B71C1C] p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by mentor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E57373] transition duration-300"
        />

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/4 px-4 py-2 rounded bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#E57373] transition duration-300"
        >
          <option value="None">Sort by Rating</option>
          <option value="HighToLow">High to Low</option>
          <option value="LowToHigh">Low to High</option>
        </select>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentMentors.map((mentor, index) => (
          <Link
            key={mentor.id}
            href={`/mentor/${mentor.id}`}
            className="bg-[#E0E0E0] text-[#B71C1C] rounded-xl p-5 shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={mentor.profileImage || "/default-avatar.avif"}
                alt={mentor.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{mentor.name}</h2>
              <p className="text-[#B71C1C] text-sm mt-1">
                {mentor.description || "No description available."}
              </p>
              <p className="text-xs text-[#B71C1C] mt-2">
                Rating: {mentor.rating || "Not rated yet"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded shadow ${
              currentPage === page
                ? "bg-[#B71C1C] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: scale(0.95);
          animation: fadeInScale 0.5s forwards;
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

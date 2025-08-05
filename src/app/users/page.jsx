////////////////////////
"use client";

import { useEffect, useState } from "react";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { MessageCircle, User } from "lucide-react";
import { generateChatId } from "@/lib/chatFunctions";
const ITEMS_PER_PAGE = 6;

export default function UsersList() {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDefaultAvatar = (role) => {
    switch (role?.toLowerCase()) {
      case "company":
        return "/default-logo.avif";
      case "freelancer":
        return "/default--avatar.avif";
      case "mentor":
        return "/default-avatar.avif";
      default:
        return "/default-avatar.avif";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== currentUser?.uid);
        setUsers(usersData);
      } catch (e) {
        console.error("Error fetching users:", e);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchUsers();
  }, [currentUser]);

  const handleStartChat = async (otherUserId) => {
    if (!currentUser) return;

    try {
      const chatId = generateChatId(currentUser.uid, otherUserId);
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [currentUser.uid, otherUserId],
          createdAt: serverTimestamp(),
          lastMessage: "",
        });
      }
      window.location.href = `/chat/${chatId}`;
    } catch (e) {
      console.error("Error starting chat:", e);
      setError("Failed to start chat. Please try again.");
    }
  };

  const handleViewProfile = (user) => {
    const role = user.role?.toLowerCase();

    if (role === "mentor") {
      window.location.href = `/mentors/${user.id}`;
    } else if (role === "freelancer") {
      window.location.href = `/profile`;
    } else if (role === "company") {
      window.location.href = `/company`;
    } else {
      window.location.href = `/profile`;
    }
  };

  const getRoleTitle = (role) => {
    switch (role?.toLowerCase()) {
      case "mentor":
        return "Mentor";
      case "freelancer":
        return "Freelancer";
      case "company":
        return "Company";
      default:
        return "User";
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  if (!currentUser) return <p>Please log in to view users.</p>;
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-20 px-4">
      <h2 className="text-4xl font-bold mb-12 text-center text-[var(--primary)]">
        Available Users
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-gray-100"
          >
            {/* Profile Image with circular border */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-transparent overflow-hidden">
                <img
                  src={user.profileImage || getDefaultAvatar(user.role)}
                  alt={user.name}
                  className="w-full h-full object-cover hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>

            {/* User Name */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
              {user.name || "No Name"}
            </h3>

            {/* User Role */}
            <p className="text-gray-600 text-sm font-medium mb-6 tracking-wider uppercase">
              {getRoleTitle(user.role)}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => handleViewProfile(user)}
                className="bg-[var(--primary)] hover:bg-opacity-10 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>View Profile</span>
              </button>

              {/* <button
                onClick={() => handleStartChat(user.id)}
                className="bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-[var(--primary)] hover:border-transparent hover:text-white px-4 py-2 rounded-full transition-all duration-300"
                title="Start Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </button> */}
              {user.role?.toLowerCase() !== "company" && (
                <button
                  onClick={() => handleStartChat(user.id)}
                  className="bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-[var(--primary)] hover:border-transparent hover:text-white px-4 py-2 rounded-full transition-all duration-300"
                  title="Start Chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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

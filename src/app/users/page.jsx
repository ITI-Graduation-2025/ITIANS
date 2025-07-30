// "use client";

// import { useEffect, useState } from "react";
// import {
//   doc,
//   collection,
//   query,
//   where,
//   getDoc,
//   getDocs,
//   setDoc,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import useCurrentUser from "@/hooks/useCurrentUser";
// import { MessageCircle } from "lucide-react";
// import { generateChatId } from "@/lib/chatFunctions";
// const ITEMS_PER_PAGE = 6;

// export default function UsersList() {
//   const currentUser = useCurrentUser();
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const usersData = querySnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .filter((user) => user.id !== currentUser?.uid);
//         setUsers(usersData);
//       } catch (e) {
//         console.error("Error fetching users:", e);
//         setError("Failed to load users. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUser) fetchUsers();
//   }, [currentUser]);

//   const handleStartChat = async (otherUserId) => {
//     if (!currentUser) return;

//     try {
//       const chatId = generateChatId(currentUser.uid, otherUserId);
//       const chatRef = doc(db, "chats", chatId);
//       const chatSnap = await getDoc(chatRef);

//       if (!chatSnap.exists()) {
//         await setDoc(chatRef, {
//           participants: [currentUser.uid, otherUserId],
//           createdAt: serverTimestamp(),
//           lastMessage: "",
//         });
//       }
//       window.location.href = `/chat/${chatId}`;
//     } catch (e) {
//       console.error("Error starting chat:", e);
//       setError("Failed to start chat. Please try again.");
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentUsers = filteredUsers.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE,
//   );

//   const handlePageChange = (page) => setCurrentPage(page);

//   if (!currentUser) return <p>Please log in to view users.</p>;
//   if (loading) return <p>Loading users...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-5xl mx-auto mt-10 mb-20">
//       <h2 className="text-3xl font-bold mb-6 text-center text-[#9E2A2B]">
//         Available Users
//       </h2>

//       <input
//         type="text"
//         placeholder="Search users by name or email..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full mb-6 p-2 border border-gray-300 rounded"
//       />

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {currentUsers.map((user) => (
//           <div
//             key={user.id}
//             className="bg-[#E0E0E0] p-4 rounded-lg shadow flex flex-col items-center text-center transform transition duration-500 hover:scale-105"
//           >
//             <img
//               src={user.profileImage || "/default--avatar.avif"}
//               alt={user.name}
//               className="w-20 h-20 rounded-full mb-3 object-cover"
//             />
//             <h3 className="text-lg font-semibold text-[#9E2A2B]">
//               {user.name || "No Name"}
//             </h3>
//             <p className="text-gray-700 text-sm mb-3">{user.email}</p>
//             <button
//               onClick={() => handleStartChat(user.id)}
//               className="bg-[#9E2A2B] hover:bg-[#7b1c1d] text-white py-2 px-3 rounded-full"
//               title="Start Chat"
//             >
//               <MessageCircle className="w-5 h-5" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 space-x-2">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => handlePageChange(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1
//                   ? "bg-[#9E2A2B] text-white"
//                   : "bg-[#E0E0E0] text-[#9E2A2B] border border-[#9E2A2B]"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
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
import { MessageCircle } from "lucide-react";
import { generateChatId } from "@/lib/chatFunctions";
const ITEMS_PER_PAGE = 6;

export default function UsersList() {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
    <div className="max-w-5xl mx-auto mt-10 mb-20">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#9E2A2B]">
        Available Users
      </h2>

      <input
        type="text"
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-6 p-2 border border-gray-300 rounded"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="bg-[#E0E0E0] p-4 rounded-lg shadow flex flex-col items-center text-center transform transition duration-500 hover:scale-105"
          >
            <img
              src={user.profileImage || "/default--avatar.avif"}
              alt={user.name}
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
            <h3 className="text-lg font-semibold text-[#9E2A2B]">
              {user.name || "No Name"}
            </h3>
            <p className="text-gray-700 text-sm mb-3">{user.email}</p>
            <button
              onClick={() => handleStartChat(user.id)}
              className="bg-[#9E2A2B] hover:bg-[#7b1c1d] text-white py-2 px-3 rounded-full"
              title="Start Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 items-center">
          <button
            onClick={handlePrev}
            className="px-3 py-1 rounded bg-[#E0E0E0] text-[#9E2A2B] hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {getPaginationNumbers().map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? "bg-[#9E2A2B] text-white" : "bg-[#E0E0E0] text-[#9E2A2B] border border-[#E0E0E0]"} hover:bg-gray-300`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded bg-[#E0E0E0] text-[#9E2A2B] hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

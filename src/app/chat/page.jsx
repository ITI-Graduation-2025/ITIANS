"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";
import { generateChatId, createChat } from "@/lib/chatFunctions";
import ChatScreen from "./ChatScreen";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ChatsPage() {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all users from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUser.uid); // Exclude current user
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle user click to start or open a chat
  const handleUserClick = async (otherUserId) => {
    const chatId = await createChat(currentUser.uid, otherUserId);
    setSelectedChatId(chatId);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!currentUser)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading user ...
      </p>
    );
  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading Users ...
      </p>
    );

  return (
    <div className="flex h-[80vh] max-w-6xl mx-auto m-6 gap-4 px-4">
      {/* Sidebar */}
      <div className="w-1/3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search for a user ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className={`flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${
                  selectedChatId === generateChatId(currentUser.uid, user.id)
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-semibold bg-red-700">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.name || "Unknown"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500 dark:text-gray-400">
              No users Available
            </p>
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="w-2/3">
        {selectedChatId ? (
          <ChatScreen chatId={selectedChatId} currentUser={currentUser} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Choose a user to start chatting with ...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

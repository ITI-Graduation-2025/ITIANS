// // src/app/chat/ChatApp.jsx
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import {
//   MagnifyingGlassIcon,
//   EllipsisHorizontalIcon,
//   XMarkIcon,
//   PaperAirplaneIcon,
//   FaceSmileIcon,
//   EllipsisVerticalIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   doc,
//   getDoc,
//   addDoc,
//   serverTimestamp,
//   updateDoc,
//   deleteDoc,
//   where,
//   getDocs,
//   limit,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import useCurrentUser from "@/hooks/useCurrentUser";
// import {
//   generateChatId,
//   createChat,
//   getOrCreateChatId,
// } from "@/lib/chatFunctions";
// import { formatDistanceToNow } from "date-fns";
// import Loading from "@/components/componentts/Loading";

// const generateBackgroundColor = (senderId) => {
//   const colors = [
//     "bg-red-500",
//     "bg-blue-500",
//     "bg-green-500",
//     "bg-yellow-500",
//     "bg-purple-500",
//     "bg-pink-500",
//     "bg-teal-500",
//   ];
//   const index = senderId.charCodeAt(0) % colors.length;
//   return colors[index];
// };

// export default function ChatApp() {
//   const currentUser = useCurrentUser();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("chats");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [selectedChatData, setSelectedChatData] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [showChatMenu, setShowChatMenu] = useState(null);
//   const [showHeaderMenu, setShowHeaderMenu] = useState(false);
//   const [showMessageMenu, setShowMessageMenu] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [userProfiles, setUserProfiles] = useState({});
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingName, setTypingName] = useState("");
//   const [editMessage, setEditMessage] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [showScrollToBottom, setShowScrollToBottom] = useState(false);

//   const messagesEndRef = useRef(null);
//   const messageRefs = useRef({});
//   const messagesContainerRef = useRef(null);

//   // Navigate to user profile
//   const handleProfileClick = (user) => {
//     if (user.role === "mentor") {
//       router.push(`/mentor/${user.id}`);
//     } else {
//       router.push(`/profile?id=${user.id}`);
//     }
//   };

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".menu-container")) {
//         setShowChatMenu(null);
//         setShowHeaderMenu(false);
//         setShowMessageMenu(null);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
//       setShowScrollToBottom(!isNearBottom && messages.length > 0);
//     };

//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [messages.length]);

//   // Fetch all users (excluding companies)
//   useEffect(() => {
//     if (!currentUser) return;

//     const usersRef = collection(db, "users");
//     const unsubscribe = onSnapshot(usersRef, (snapshot) => {
//       const usersData = snapshot.docs
//         .map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//         .filter(
//           (user) => user.id !== currentUser.uid && user.role !== "company",
//         );
//       setUsers(usersData);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   // Fetch user's chats
//   useEffect(() => {
//     if (!currentUser) return;

//     const chatsRef = collection(db, "chats");
//     const q = query(
//       chatsRef,
//       where("participants", "array-contains", currentUser.uid),
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const chatsData = await Promise.all(
//         snapshot.docs.map(async (chatDoc) => {
//           const data = chatDoc.data();
//           const otherUserId = data.participants.find(
//             (uid) => uid !== currentUser.uid,
//           );

//           // Get other user's data
//           const userRef = doc(db, "users", otherUserId);
//           const userSnap = await getDoc(userRef);
//           const userData = userSnap.exists() ? userSnap.data() : {};

//           // Count unread messages
//           const messagesRef = collection(db, "chats", chatDoc.id, "messages");
//           const unreadQuery = query(
//             messagesRef,
//             orderBy("createdAt", "desc"),
//             limit(50),
//           );
//           const unreadSnap = await getDocs(unreadQuery);
//           const unreadCount = unreadSnap.docs.filter((doc) => {
//             const msgData = doc.data();
//             return msgData.senderId !== currentUser.uid && !msgData.read;
//           }).length;

//           return {
//             id: chatDoc.id,
//             ...data,
//             otherUser: {
//               id: otherUserId,
//               name: userData.name || userData.displayName || "Unknown",
//               profileImage: userData.profileImage || null,
//               role: userData.role || "freelancer",
//             },
//             unreadCount,
//           };
//         }),
//       );

//       // Sort by lastMessageAt
//       chatsData.sort((a, b) => {
//         if (!a.lastMessageAt) return 1;
//         if (!b.lastMessageAt) return -1;
//         return b.lastMessageAt.toDate() - a.lastMessageAt.toDate();
//       });

//       setChats(chatsData);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   // Listen to messages when a chat is selected
//   useEffect(() => {
//     if (!selectedChat) return;

//     const q = query(
//       collection(db, "chats", selectedChat, "messages"),
//       orderBy("createdAt", "asc"),
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setMessages(msgs);

//       // Mark messages as read when chat is opened
//       const unreadMessages = msgs.filter(
//         (msg) => msg.senderId !== currentUser.uid && !msg.read,
//       );

//       for (const msg of unreadMessages) {
//         const messageRef = doc(db, "chats", selectedChat, "messages", msg.id);
//         await updateDoc(messageRef, { read: true });
//       }

//       // Build user profiles
//       const senderIds = [...new Set(msgs.map((msg) => msg.senderId))];
//       const profiles = {};
//       for (const senderId of senderIds) {
//         const userRef = doc(db, "users", senderId);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           const userData = userSnap.data();
//           const displayName =
//             userData.displayName ||
//             userData.name ||
//             userData.username ||
//             senderId ||
//             "Unknown";
//           profiles[senderId] = {
//             profileImage: userData.profileImage || null,
//             displayName: displayName,
//             initial: (displayName || "U")[0].toUpperCase(),
//             bgColor: generateBackgroundColor(senderId),
//             role: userData.role || "freelancer",
//             id: senderId,
//           };
//         }
//       }
//       setUserProfiles(profiles);
//     });

//     return () => unsubscribe();
//   }, [selectedChat, currentUser]);

//   // Listen to chat data for typing indicators
//   useEffect(() => {
//     if (!selectedChat || !currentUser) return;

//     const chatRef = doc(db, "chats", selectedChat);
//     const unsubscribe = onSnapshot(chatRef, async (doc) => {
//       if (!doc.exists()) return;

//       const data = doc.data();
//       setSelectedChatData(data);

//       // Handle typing
//       if (data?.typing && data.typing !== currentUser.uid) {
//         setIsTyping(true);
//         setTypingName(data.typingName || "Someone");
//       } else {
//         setIsTyping(false);
//         setTypingName("");
//       }
//     });

//     return () => unsubscribe();
//   }, [selectedChat, currentUser]);

//   // Handle typing indicator
//   useEffect(() => {
//     if (!selectedChat || !currentUser) return;

//     const chatRef = doc(db, "chats", selectedChat);
//     const handleTyping = async () => {
//       try {
//         if (newMessage.trim()) {
//           await updateDoc(chatRef, {
//             typing: currentUser.uid,
//             typingName: currentUser.name,
//           });
//         } else {
//           await updateDoc(chatRef, {
//             typing: null,
//             typingName: null,
//           });
//         }
//       } catch (error) {
//         console.error("Error updating typing status:", error);
//       }
//     };
//     handleTyping();
//   }, [newMessage, selectedChat, currentUser]);

//   const scrollToBottom = () => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTo({
//         top: messagesContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const filteredUsers = users.filter((user) =>
//     user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const filteredChats = chats.filter(
//     (chat) =>
//       chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (chat.lastMessage &&
//         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())),
//   );

//   const getDefaultAvatar = (role) => {
//     return role === "mentor" ? "/default-avatar.avif" : "/default--avatar.avif";
//   };

//   const handleUserClick = async (user) => {
//     try {
//       const chatId = await getOrCreateChatId(currentUser.uid, user.id);
//       setSelectedChat(chatId);
//     } catch (error) {
//       console.error("Error creating chat:", error);
//     }
//   };

//   const handleChatClick = (chat) => {
//     setSelectedChat(chat.id);
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       await addDoc(collection(db, "chats", selectedChat, "messages"), {
//         senderId: currentUser.uid,
//         senderName: currentUser.name,
//         text: newMessage.trim(),
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       // Update last message in chat
//       const chatRef = doc(db, "chats", selectedChat);
//       await updateDoc(chatRef, {
//         lastMessage: newMessage.trim(),
//         lastMessageAt: serverTimestamp(),
//       });

//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleEditMessage = async () => {
//     if (!editText.trim() || !editMessage) return;
//     try {
//       const messageRef = doc(
//         db,
//         "chats",
//         selectedChat,
//         "messages",
//         editMessage.id,
//       );
//       await updateDoc(messageRef, {
//         text: editText.trim(),
//         edited: true,
//         updatedAt: serverTimestamp(),
//       });

//       // Update last message in chat if this was the last message
//       const chatRef = doc(db, "chats", selectedChat);
//       await updateDoc(chatRef, {
//         lastMessage: editText.trim(),
//         lastMessageAt: serverTimestamp(),
//       });

//       setEditMessage(null);
//       setEditText("");
//       setShowMessageMenu(null);
//     } catch (error) {
//       console.error("Error editing message:", error);
//     }
//   };

//   const handleDeleteMessage = async () => {
//     if (!confirmDelete) return;
//     try {
//       const messageRef = doc(
//         db,
//         "chats",
//         selectedChat,
//         "messages",
//         confirmDelete.messageId,
//       );

//       if (confirmDelete.forEveryone) {
//         await updateDoc(messageRef, {
//           deletedForEveryone: true,
//         });
//       } else {
//         await updateDoc(messageRef, {
//           deleted: { [currentUser.uid]: true },
//         });
//       }

//       // Update last message in chat
//       const chatRef = doc(db, "chats", selectedChat);
//       await updateDoc(chatRef, {
//         lastMessage: "Message deleted",
//         lastMessageAt: serverTimestamp(),
//       });

//       setConfirmDelete(null);
//       setShowMessageMenu(null);
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   };

//   const handleDeleteChat = async (chatId) => {
//     try {
//       // Delete all messages first
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const messagesQuery = query(messagesRef);
//       const messagesSnapshot = await getDocs(messagesQuery);

//       const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
//         deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id)),
//       );
//       await Promise.all(deletePromises);

//       // Then delete the chat
//       await deleteDoc(doc(db, "chats", chatId));

//       if (selectedChat === chatId) {
//         setSelectedChat(null);
//       }
//       setShowChatMenu(null);
//       setShowHeaderMenu(false);
//     } catch (error) {
//       console.error("Error deleting chat:", error);
//     }
//   };

//   const closeChat = () => {
//     setSelectedChat(null);
//     setSelectedChatData(null);
//     setMessages([]);
//   };

//   const isNearHeader = (msgId) => {
//     const messageElement = messageRefs.current[msgId];
//     if (messageElement) {
//       const rect = messageElement.getBoundingClientRect();
//       return rect.top < 200;
//     }
//     return false;
//   };

//   if (!currentUser) {
//     return <Loading />;
//   }

//   const totalUnreadCount = chats.reduce(
//     (total, chat) => total + chat.unreadCount,
//     0,
//   );

//   return (
//     <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
//       <div className="h-[85vh] w-full max-w-7xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex">
//         {/* Section 1: Profile and Tabs */}
//         <div className="w-80 bg-gradient-to-b from-[#901b20] to-[#7a1519] flex flex-col">
//           <div className="flex flex-col items-center text-center py-8 px-6 flex-shrink-0">
//             {/* User Profile */}
//             <div className="mb-6">
//               <div className="flex flex-col items-center gap-3">
//                 <div
//                   onClick={() => handleProfileClick(currentUser)}
//                   className="cursor-pointer hover:scale-105 transition-transform duration-200"
//                 >
//                   {currentUser.profileImage ? (
//                     <img
//                       src={currentUser.profileImage}
//                       alt={currentUser.name}
//                       className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg hover:border-white/50 transition-colors"
//                     />
//                   ) : (
//                     <img
//                       src={getDefaultAvatar(currentUser.role || "freelancer")}
//                       alt={currentUser.name}
//                       className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg hover:border-white/50 transition-colors"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg text-white">
//                     {currentUser.name}
//                   </h3>
//                   <p className="text-white/80 text-sm capitalize">
//                     {currentUser.role}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Tab Buttons */}
//             <div className="w-full space-y-3">
//               <button
//                 onClick={() => handleTabChange("chats")}
//                 className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
//                   activeTab === "chats"
//                     ? "bg-white text-[#901b20] shadow-lg"
//                     : "bg-white/10 text-white hover:bg-white/20"
//                 }`}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   My Chats
//                   {totalUnreadCount > 0 && (
//                     <span className="bg-red-800 text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px]">
//                       {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
//                     </span>
//                   )}
//                 </div>
//               </button>
//               <button
//                 onClick={() => handleTabChange("users")}
//                 className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
//                   activeTab === "users"
//                     ? "bg-white text-[#901b20] shadow-lg"
//                     : "bg-white/10 text-white hover:bg-white/20"
//                 }`}
//               >
//                 Users
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Section 2: Content List */}
//         <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
//           {/* Search Bar */}
//           <div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
//             <div className="relative">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={`Search ${activeTab}...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-white transition-all"
//               />
//             </div>
//           </div>

//           {/* List Content with fixed height and scroll */}
//           <div className="flex-1 overflow-y-auto">
//             {activeTab === "chats" ? (
//               // Chats List
//               <div>
//                 {filteredChats.length > 0 ? (
//                   filteredChats.map((chat) => (
//                     <div
//                       key={chat.id}
//                       className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-all border-b border-gray-100 group"
//                       onClick={() => handleChatClick(chat)}
//                     >
//                       <div
//                         className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleProfileClick(chat.otherUser);
//                         }}
//                       >
//                         {chat.otherUser.profileImage ? (
//                           <img
//                             src={chat.otherUser.profileImage}
//                             alt={chat.otherUser.name}
//                             className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                           />
//                         ) : (
//                           <img
//                             src={getDefaultAvatar(chat.otherUser.role)}
//                             alt={chat.otherUser.name}
//                             className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                           />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-1">
//                           <h4 className="font-medium text-gray-900 truncate text-sm">
//                             {chat.otherUser.name}
//                           </h4>
//                           <div className="flex items-center gap-2">
//                             {chat.lastMessageAt && (
//                               <span className="text-xs text-gray-500">
//                                 {formatDistanceToNow(
//                                   new Date(chat.lastMessageAt.toDate()),
//                                   { addSuffix: true },
//                                 )}
//                               </span>
//                             )}
//                             <div className="menu-container">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setShowChatMenu(
//                                     showChatMenu === chat.id ? null : chat.id,
//                                   );
//                                 }}
//                                 className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
//                               >
//                                 <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
//                               </button>
//                               {showChatMenu === chat.id && (
//                                 <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 w-32">
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDeleteChat(chat.id);
//                                     }}
//                                     className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
//                                   >
//                                     Delete Chat
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <p className="text-xs text-gray-600 truncate">
//                             {chat.lastMessage || "No messages yet"}
//                           </p>
//                           {chat.unreadCount > 0 && (
//                             <span className="bg-[#901b20] text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center font-medium">
//                               {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     <FaceSmileIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-sm">
//                       {searchTerm ? "No chats found" : "No chats yet"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // Users List
//               <div>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       onClick={() => handleUserClick(user)}
//                       className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-all border-b border-gray-100 group"
//                     >
//                       <div
//                         className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleProfileClick(user);
//                         }}
//                       >
//                         {user.profileImage ? (
//                           <img
//                             src={user.profileImage}
//                             alt={user.name}
//                             className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                           />
//                         ) : (
//                           <img
//                             src={getDefaultAvatar(user.role)}
//                             alt={user.name}
//                             className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                           />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-gray-900 truncate text-sm">
//                           {user.name || "Unknown"}
//                         </h4>
//                         <p className="text-xs text-gray-500 capitalize truncate">
//                           {user.role}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-sm">
//                       {searchTerm ? "No users found" : "No users available"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Section 3: Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <>
//               {/* Chat Header */}
//               <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
//                 <div className="flex items-center gap-3">
//                   {selectedChatData && (
//                     <>
//                       {(() => {
//                         const otherUserId = selectedChatData.participants?.find(
//                           (uid) => uid !== currentUser.uid,
//                         );
//                         const otherUserProfile = userProfiles[otherUserId];
//                         const chatData = chats.find(
//                           (c) => c.id === selectedChat,
//                         );
//                         const otherUser = chatData?.otherUser;

//                         return (
//                           <>
//                             <div
//                               className="cursor-pointer hover:scale-105 transition-transform"
//                               onClick={() => {
//                                 const userToNavigate = {
//                                   id: otherUserId,
//                                   role:
//                                     otherUserProfile?.role ||
//                                     otherUser?.role ||
//                                     "freelancer",
//                                 };
//                                 handleProfileClick(userToNavigate);
//                               }}
//                             >
//                               {otherUserProfile?.profileImage ||
//                               otherUser?.profileImage ? (
//                                 <img
//                                   src={
//                                     otherUserProfile?.profileImage ||
//                                     otherUser?.profileImage
//                                   }
//                                   alt={
//                                     otherUserProfile?.displayName ||
//                                     otherUser?.name
//                                   }
//                                   className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                                 />
//                               ) : (
//                                 <img
//                                   src={getDefaultAvatar(
//                                     otherUserProfile?.role ||
//                                       otherUser?.role ||
//                                       "freelancer",
//                                   )}
//                                   alt={
//                                     otherUserProfile?.displayName ||
//                                     otherUser?.name
//                                   }
//                                   className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                                 />
//                               )}
//                             </div>
//                             <div>
//                               <h3 className="font-medium text-gray-900">
//                                 {otherUserProfile?.displayName ||
//                                   otherUser?.name ||
//                                   "Unknown"}
//                               </h3>
//                               {isTyping && (
//                                 <p className="text-sm text-[#901b20] animate-pulse">
//                                   typing...
//                                 </p>
//                               )}
//                             </div>
//                           </>
//                         );
//                       })()}
//                     </>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="menu-container">
//                     <button
//                       onClick={() => setShowHeaderMenu(!showHeaderMenu)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
//                     >
//                       <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
//                       {showHeaderMenu && (
//                         <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 w-32">
//                           <button
//                             onClick={() => {
//                               handleDeleteChat(selectedChat);
//                               setShowHeaderMenu(false);
//                             }}
//                             className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
//                           >
//                             Delete Chat
//                           </button>
//                         </div>
//                       )}
//                     </button>
//                   </div>
//                   <button
//                     onClick={closeChat}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <XMarkIcon className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages Container */}
//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
//               >
//                 {messages.length > 0 ? (
//                   messages.map((msg, index) => (
//                     <div
//                       key={msg.id}
//                       ref={(el) => (messageRefs.current[msg.id] = el)}
//                       className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} items-start gap-2`}
//                     >
//                       {msg.senderId !== currentUser.uid && (
//                         <>
//                           <div
//                             className="cursor-pointer hover:scale-105 transition-transform"
//                             onClick={() => {
//                               const userProfile = userProfiles[msg.senderId];
//                               if (userProfile) {
//                                 handleProfileClick(userProfile);
//                               }
//                             }}
//                           >
//                             {userProfiles[msg.senderId]?.profileImage ? (
//                               <img
//                                 src={userProfiles[msg.senderId].profileImage}
//                                 alt="Profile"
//                                 className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                               />
//                             ) : (
//                               <img
//                                 src={getDefaultAvatar(
//                                   userProfiles[msg.senderId]?.role ||
//                                     "freelancer",
//                                 )}
//                                 alt="Profile"
//                                 className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                               />
//                             )}
//                           </div>
//                         </>
//                       )}

//                       <div
//                         className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
//                           msg.senderId === currentUser.uid
//                             ? "bg-[#901b20] text-white"
//                             : "bg-white text-gray-900 border border-gray-200"
//                         }`}
//                       >
//                         {(msg.deleted && msg.deleted[currentUser.uid]) ||
//                         msg.deletedForEveryone ? (
//                           <div className="italic text-sm text-gray-300 flex items-center gap-2">
//                             This message was deleted
//                           </div>
//                         ) : (
//                           <>
//                             <div className="text-sm">{msg.text}</div>
//                             <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
//                               <span>
//                                 {msg.createdAt
//                                   ? formatDistanceToNow(
//                                       new Date(msg.createdAt.toDate()),
//                                       {
//                                         addSuffix: true,
//                                       },
//                                     )
//                                   : "Just now"}
//                               </span>
//                               {msg.edited && (
//                                 <span className="italic bg-black/10 px-1 py-0.5 rounded text-xs">
//                                   edited
//                                 </span>
//                               )}
//                             </div>
//                           </>
//                         )}
//                       </div>

//                       {msg.senderId === currentUser.uid &&
//                         !msg.deleted?.[currentUser.uid] &&
//                         !msg.deletedForEveryone && (
//                           <div className="menu-container relative">
//                             <button
//                               onClick={() =>
//                                 setShowMessageMenu(
//                                   showMessageMenu === msg.id ? null : msg.id,
//                                 )
//                               }
//                               className="p-1 text-gray-500 hover:text-gray-600 hover:bg-white/20 rounded-full transition-all"
//                             >
//                               <EllipsisVerticalIcon className="h-4 w-4" />
//                             </button>
//                             {showMessageMenu === msg.id && (
//                               <div
//                                 className={`absolute ${
//                                   isNearHeader(msg.id)
//                                     ? "top-0 right-[calc(100%+0.5rem)]"
//                                     : "top-[-1rem] right-6"
//                                 } bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-40 overflow-hidden`}
//                               >
//                                 <button
//                                   onClick={() => {
//                                     setEditMessage(msg);
//                                     setEditText(msg.text);
//                                     setShowMessageMenu(null);
//                                   }}
//                                   className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setConfirmDelete({
//                                       messageId: msg.id,
//                                       forEveryone: false,
//                                     });
//                                     setShowMessageMenu(null);
//                                   }}
//                                   className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
//                                 >
//                                   Delete for Me
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setConfirmDelete({
//                                       messageId: msg.id,
//                                       forEveryone: true,
//                                     });
//                                     setShowMessageMenu(null);
//                                   }}
//                                   className="block w-full text-left px-3 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors"
//                                 >
//                                   Delete for Everyone
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}

//                       {msg.senderId === currentUser.uid && (
//                         <>
//                           <div
//                             className="cursor-pointer hover:scale-105 transition-transform"
//                             onClick={() => handleProfileClick(currentUser)}
//                           >
//                             {userProfiles[msg.senderId]?.profileImage ? (
//                               <img
//                                 src={userProfiles[msg.senderId].profileImage}
//                                 alt="Profile"
//                                 className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                               />
//                             ) : (
//                               <img
//                                 src={getDefaultAvatar(
//                                   userProfiles[msg.senderId]?.role ||
//                                     currentUser.role ||
//                                     "freelancer",
//                                 )}
//                                 alt="Profile"
//                                 className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                               />
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
//                         <FaceSmileIcon className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-600 mb-2">
//                         No messages yet
//                       </h3>
//                       <p className="text-gray-500 text-sm">
//                         Start the conversation!
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />

//                 {/* Scroll to Bottom Button */}
//                 {showScrollToBottom && (
//                   <button
//                     onClick={scrollToBottom}
//                     className="fixed bottom-20 right-8 bg-[#901b20] hover:bg-[#7a1519] text-white p-2 rounded-full shadow-lg transition-all z-50"
//                   >
//                     <ChevronDownIcon className="h-5 w-5" />
//                   </button>
//                 )}
//               </div>

//               {/* Message Input */}
//               <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
//                 <div className="flex items-center gap-3">
//                   <button className="p-2 text-gray-400 hover:text-[#901b20] transition-colors rounded-full hover:bg-gray-100">
//                     <FaceSmileIcon className="h-5 w-5" />
//                   </button>
//                   <div className="flex-1 relative">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type a message..."
//                       className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-gray-50 transition-all"
//                     />
//                   </div>
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim()}
//                     className="p-2 bg-[#901b20] text-white rounded-full hover:bg-[#7a1519] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
//                   >
//                     <PaperAirplaneIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center bg-gray-50">
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-[#901b20] rounded-full flex items-center justify-center mx-auto mb-6">
//                   <FaceSmileIcon className="h-12 w-12 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                   Welcome to Chat
//                 </h3>
//                 <p className="text-gray-600 max-w-md mx-auto">
//                   Select a user or chat to start messaging
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Message Modal */}
//       {editMessage && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
//             <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
//               Edit Message
//             </h3>
//             <textarea
//               value={editText}
//               onChange={(e) => setEditText(e.target.value)}
//               className="w-full p-3 rounded-lg border border-gray-300 mb-4 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#901b20] bg-gray-50"
//               placeholder="Type your message..."
//             />
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => {
//                   setEditMessage(null);
//                   setEditText("");
//                 }}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditMessage}
//                 className="px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519] transition-all"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
//             <div className="text-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 {confirmDelete.forEveryone
//                   ? "Delete for Everyone?"
//                   : "Delete for You?"}
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 {confirmDelete.forEveryone
//                   ? "This message will be removed for all participants."
//                   : "This will only hide the message for you."}
//               </p>
//             </div>
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteMessage}
//                 className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
///////////////////////////////////
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
  generateChatId,
  createChat,
  getOrCreateChatId,
  navigateToChat,
} from "@/lib/chatFunctions";
import { formatDistanceToNow } from "date-fns";
import Loading from "@/components/componentts/loading";

const generateBackgroundColor = (senderId) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const index = senderId.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function ChatApp() {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatData, setSelectedChatData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatMenu, setShowChatMenu] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState("");
  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const messagesContainerRef = useRef(null);

  // Navigate to user profile
  const handleProfileClick = (user) => {
    if (user.role === "mentor") {
      router.push(`/mentor/${user.id}`);
    } else {
      router.push(`/profile?id=${user.id}`);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setShowChatMenu(null);
        setShowHeaderMenu(false);
        setShowMessageMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Fetch all users (excluding companies)
  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (user) => user.id !== currentUser.uid && user.role !== "company",
        );
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch user's chats
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (chatDoc) => {
          const data = chatDoc.data();
          const otherUserId = data.participants.find(
            (uid) => uid !== currentUser.uid,
          );

          // Get other user's data
          const userRef = doc(db, "users", otherUserId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          // Count unread messages
          const messagesRef = collection(db, "chats", chatDoc.id, "messages");
          const unreadQuery = query(
            messagesRef,
            orderBy("createdAt", "desc"),
            limit(50),
          );
          const unreadSnap = await getDocs(unreadQuery);
          const unreadCount = unreadSnap.docs.filter((doc) => {
            const msgData = doc.data();
            return msgData.senderId !== currentUser.uid && !msgData.read;
          }).length;

          return {
            id: chatDoc.id,
            ...data,
            otherUser: {
              id: otherUserId,
              name: userData.name || userData.displayName || "Unknown",
              profileImage: userData.profileImage || null,
              role: userData.role || "freelancer",
            },
            unreadCount,
          };
        }),
      );

      // Sort by lastMessageAt
      chatsData.sort((a, b) => {
        if (!a.lastMessageAt) return 1;
        if (!b.lastMessageAt) return -1;
        return b.lastMessageAt.toDate() - a.lastMessageAt.toDate();
      });

      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Listen to messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const chatRef = doc(db, "chats", selectedChat);
    getDoc(chatRef)
      .then((chatSnap) => {
        if (!chatSnap.exists()) {
          console.warn(`Chat ${selectedChat} does not exist`);
          setMessages([]);
          setSelectedChat(null);
          router.push("/chat");
          return;
        }

        const q = query(
          collection(db, "chats", selectedChat, "messages"),
          orderBy("createdAt", "asc"),
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(msgs);

          // Mark messages as read when chat is opened
          const unreadMessages = msgs.filter(
            (msg) => msg.senderId !== currentUser.uid && !msg.read,
          );

          for (const msg of unreadMessages) {
            const messageRef = doc(
              db,
              "chats",
              selectedChat,
              "messages",
              msg.id,
            );
            const messageSnap = await getDoc(messageRef);
            if (messageSnap.exists()) {
              await updateDoc(messageRef, { read: true });
            } else {
              console.warn(
                `Message ${msg.id} does not exist in chat ${selectedChat}`,
              );
            }
          }

          // Build user profiles
          const senderIds = [...new Set(msgs.map((msg) => msg.senderId))];
          const profiles = {};
          for (const senderId of senderIds) {
            const userRef = doc(db, "users", senderId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const displayName =
                userData.displayName ||
                userData.name ||
                userData.username ||
                senderId ||
                "Unknown";
              profiles[senderId] = {
                profileImage: userData.profileImage || null,
                displayName: displayName,
                initial: (displayName || "U")[0].toUpperCase(),
                bgColor: generateBackgroundColor(senderId),
                role: userData.role || "freelancer",
                id: senderId,
              };
            }
          }
          setUserProfiles(profiles);
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error checking chat existence:", error);
        setMessages([]);
        setSelectedChat(null);
        router.push("/chat");
      });
  }, [selectedChat, currentUser, router]);

  // Listen to chat data for typing indicators
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const chatRef = doc(db, "chats", selectedChat);
    const unsubscribe = onSnapshot(chatRef, async (doc) => {
      if (!doc.exists()) return;

      const data = doc.data();
      setSelectedChatData(data);

      // Handle typing
      if (data?.typing && data.typing !== currentUser.uid) {
        setIsTyping(true);
        setTypingName(data.typingName || "Someone");
      } else {
        setIsTyping(false);
        setTypingName("");
      }
    });

    return () => unsubscribe();
  }, [selectedChat, currentUser]);

  // Handle typing indicator
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const chatRef = doc(db, "chats", selectedChat);
    const handleTyping = async () => {
      try {
        if (newMessage.trim()) {
          await updateDoc(chatRef, {
            typing: currentUser.uid,
            typingName: currentUser.name,
          });
        } else {
          await updateDoc(chatRef, {
            typing: null,
            typingName: null,
          });
        }
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    };
    handleTyping();
  }, [newMessage, selectedChat, currentUser]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredChats = chats.filter(
    (chat) =>
      chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getDefaultAvatar = (role) => {
    return role === "mentor" ? "/default-avatar.avif" : "/default--avatar.avif";
  };
  const handleUserClick = async (user) => {
    try {
      const chatId = await navigateToChat(currentUser.uid, user.id);
      setSelectedChat(chatId); // Set the selected chat to display it on the same page
    } catch (error) {
      console.error("Error starting chat:", error);
      // Optionally, show an error message to the user
    }
  };
  const handleChatClick = (chat) => {
    setSelectedChat(chat.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await addDoc(collection(db, "chats", selectedChat, "messages"), {
        senderId: currentUser.uid,
        senderName: currentUser.name,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });

      // Update last message in chat
      const chatRef = doc(db, "chats", selectedChat);
      await updateDoc(chatRef, {
        lastMessage: newMessage.trim(),
        lastMessageAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = async () => {
    if (!editText.trim() || !editMessage) return;
    try {
      const messageRef = doc(
        db,
        "chats",
        selectedChat,
        "messages",
        editMessage.id,
      );
      await updateDoc(messageRef, {
        text: editText.trim(),
        edited: true,
        updatedAt: serverTimestamp(),
      });

      // Update last message in chat if this was the last message
      const chatRef = doc(db, "chats", selectedChat);
      await updateDoc(chatRef, {
        lastMessage: editText.trim(),
        lastMessageAt: serverTimestamp(),
      });

      setEditMessage(null);
      setEditText("");
      setShowMessageMenu(null);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async () => {
    if (!confirmDelete) return;
    try {
      const messageRef = doc(
        db,
        "chats",
        selectedChat,
        "messages",
        confirmDelete.messageId,
      );

      if (confirmDelete.forEveryone) {
        await updateDoc(messageRef, {
          deletedForEveryone: true,
        });
      } else {
        await updateDoc(messageRef, {
          deleted: { [currentUser.uid]: true },
        });
      }

      // Update last message in chat
      const chatRef = doc(db, "chats", selectedChat);
      await updateDoc(chatRef, {
        lastMessage: "Message deleted",
        lastMessageAt: serverTimestamp(),
      });

      setConfirmDelete(null);
      setShowMessageMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      // Delete all messages first
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesQuery = query(messagesRef);
      const messagesSnapshot = await getDocs(messagesQuery);

      const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
        deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id)),
      );
      await Promise.all(deletePromises);

      // Then delete the chat
      await deleteDoc(doc(db, "chats", chatId));

      if (selectedChat === chatId) {
        setSelectedChat(null);
      }
      setShowChatMenu(null);
      setShowHeaderMenu(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const closeChat = () => {
    setSelectedChat(null);
    setSelectedChatData(null);
    setMessages([]);
  };

  const isNearHeader = (msgId) => {
    const messageElement = messageRefs.current[msgId];
    if (messageElement) {
      const rect = messageElement.getBoundingClientRect();
      return rect.top < 200;
    }
    return false;
  };

  if (!currentUser) {
    return <Loading />;
  }

  const totalUnreadCount = chats.reduce(
    (total, chat) => total + chat.unreadCount,
    0,
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
      <div className="h-[85vh] w-full max-w-7xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex">
        {/* Section 1: Profile and Tabs */}
        <div className="w-80 bg-gradient-to-b from-[#901b20] to-[#7a1519] flex flex-col">
          <div className="flex flex-col items-center text-center py-8 px-6 flex-shrink-0">
            {/* User Profile */}
            <div className="mb-6">
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => handleProfileClick(currentUser)}
                  className="cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg hover:border-white/50 transition-colors"
                    />
                  ) : (
                    <img
                      src={getDefaultAvatar(currentUser.role || "freelancer")}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg hover:border-white/50 transition-colors"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {currentUser.name}
                  </h3>
                  <p className="text-white/80 text-sm capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={() => handleTabChange("chats")}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "chats"
                    ? "bg-white text-[#901b20] shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  My Chats
                  {totalUnreadCount > 0 && (
                    <span className="bg-red-800 text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px]">
                      {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleTabChange("users")}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "users"
                    ? "bg-white text-[#901b20] shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Users
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Content List */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-white transition-all"
              />
            </div>
          </div>

          {/* List Content with fixed height and scroll */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "chats" ? (
              // Chats List
              <div>
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-all border-b border-gray-100 group"
                      onClick={() => handleChatClick(chat)}
                    >
                      <div
                        className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(chat.otherUser);
                        }}
                      >
                        {chat.otherUser.profileImage ? (
                          <img
                            src={chat.otherUser.profileImage}
                            alt={chat.otherUser.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                          />
                        ) : (
                          <img
                            src={getDefaultAvatar(chat.otherUser.role)}
                            alt={chat.otherUser.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate text-sm">
                            {chat.otherUser.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {chat.lastMessageAt && (
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(
                                  new Date(chat.lastMessageAt.toDate()),
                                  { addSuffix: true },
                                )}
                              </span>
                            )}
                            <div className="menu-container">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowChatMenu(
                                    showChatMenu === chat.id ? null : chat.id,
                                  );
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                              >
                                <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                              </button>
                              {showChatMenu === chat.id && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 w-32">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChat(chat.id);
                                    }}
                                    className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
                                  >
                                    Delete Chat
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600 truncate">
                            {chat.lastMessage || "No messages yet"}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-[#901b20] text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center font-medium">
                              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <FaceSmileIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm">
                      {searchTerm ? "No chats found" : "No chats yet"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Users List
              <div>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer transition-all border-b border-gray-100 group"
                    >
                      <div
                        className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(user);
                        }}
                      >
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                          />
                        ) : (
                          <img
                            src={getDefaultAvatar(user.role)}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {user.name || "Unknown"}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize truncate">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm">
                      {searchTerm ? "No users found" : "No users available"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                  {selectedChatData && (
                    <>
                      {(() => {
                        const otherUserId = selectedChatData.participants?.find(
                          (uid) => uid !== currentUser.uid,
                        );
                        const otherUserProfile = userProfiles[otherUserId];
                        const chatData = chats.find(
                          (c) => c.id === selectedChat,
                        );
                        const otherUser = chatData?.otherUser;

                        return (
                          <>
                            <div
                              className="cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => {
                                const userToNavigate = {
                                  id: otherUserId,
                                  role:
                                    otherUserProfile?.role ||
                                    otherUser?.role ||
                                    "freelancer",
                                };
                                handleProfileClick(userToNavigate);
                              }}
                            >
                              {otherUserProfile?.profileImage ||
                              otherUser?.profileImage ? (
                                <img
                                  src={
                                    otherUserProfile?.profileImage ||
                                    otherUser?.profileImage
                                  }
                                  alt={
                                    otherUserProfile?.displayName ||
                                    otherUser?.name
                                  }
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                                />
                              ) : (
                                <img
                                  src={getDefaultAvatar(
                                    otherUserProfile?.role ||
                                      otherUser?.role ||
                                      "freelancer",
                                  )}
                                  alt={
                                    otherUserProfile?.displayName ||
                                    otherUser?.name
                                  }
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {otherUserProfile?.displayName ||
                                  otherUser?.name ||
                                  "Unknown"}
                              </h3>
                              {isTyping && (
                                <p className="text-sm text-[#901b20] animate-pulse">
                                  typing...
                                </p>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="menu-container">
                    <button
                      onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
                      {showHeaderMenu && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 w-32">
                          <button
                            onClick={() => {
                              handleDeleteChat(selectedChat);
                              setShowHeaderMenu(false);
                            }}
                            className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
                          >
                            Delete Chat
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      ref={(el) => (messageRefs.current[msg.id] = el)}
                      className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} items-start gap-2`}
                    >
                      {msg.senderId !== currentUser.uid && (
                        <>
                          <div
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              const userProfile = userProfiles[msg.senderId];
                              if (userProfile) {
                                handleProfileClick(userProfile);
                              }
                            }}
                          >
                            {userProfiles[msg.senderId]?.profileImage ? (
                              <img
                                src={userProfiles[msg.senderId].profileImage}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                              />
                            ) : (
                              <img
                                src={getDefaultAvatar(
                                  userProfiles[msg.senderId]?.role ||
                                    "freelancer",
                                )}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                              />
                            )}
                          </div>
                        </>
                      )}

                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                          msg.senderId === currentUser.uid
                            ? "bg-[#901b20] text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        {(msg.deleted && msg.deleted[currentUser.uid]) ||
                        msg.deletedForEveryone ? (
                          <div className="italic text-sm text-gray-300 flex items-center gap-2">
                            This message was deleted
                          </div>
                        ) : (
                          <>
                            <div className="text-sm">{msg.text}</div>
                            <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
                              <span>
                                {msg.createdAt
                                  ? formatDistanceToNow(
                                      new Date(msg.createdAt.toDate()),
                                      {
                                        addSuffix: true,
                                      },
                                    )
                                  : "Just now"}
                              </span>
                              {msg.edited && (
                                <span className="italic bg-black/10 px-1 py-0.5 rounded text-xs">
                                  edited
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {msg.senderId === currentUser.uid &&
                        !msg.deleted?.[currentUser.uid] &&
                        !msg.deletedForEveryone && (
                          <div className="menu-container relative">
                            <button
                              onClick={() =>
                                setShowMessageMenu(
                                  showMessageMenu === msg.id ? null : msg.id,
                                )
                              }
                              className="p-1 text-gray-500 hover:text-gray-600 hover:bg-white/20 rounded-full transition-all"
                            >
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </button>
                            {showMessageMenu === msg.id && (
                              <div
                                className={`absolute ${
                                  isNearHeader(msg.id)
                                    ? "top-0 right-[calc(100%+0.5rem)]"
                                    : "top-[-1rem] right-6"
                                } bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-40 overflow-hidden`}
                              >
                                <button
                                  onClick={() => {
                                    setEditMessage(msg);
                                    setEditText(msg.text);
                                    setShowMessageMenu(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDelete({
                                      messageId: msg.id,
                                      forEveryone: false,
                                    });
                                    setShowMessageMenu(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
                                >
                                  Delete for Me
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDelete({
                                      messageId: msg.id,
                                      forEveryone: true,
                                    });
                                    setShowMessageMenu(null);
                                  }}
                                  className="block w-full text-left px-3 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors"
                                >
                                  Delete for Everyone
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                      {msg.senderId === currentUser.uid && (
                        <>
                          <div
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleProfileClick(currentUser)}
                          >
                            {userProfiles[msg.senderId]?.profileImage ? (
                              <img
                                src={userProfiles[msg.senderId].profileImage}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                              />
                            ) : (
                              <img
                                src={getDefaultAvatar(
                                  userProfiles[msg.senderId]?.role ||
                                    currentUser.role ||
                                    "freelancer",
                                )}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaceSmileIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No messages yet
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Start the conversation!
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />

                {/* Scroll to Bottom Button */}
                {showScrollToBottom && (
                  <button
                    onClick={scrollToBottom}
                    className="fixed bottom-20 right-8 bg-[#901b20] hover:bg-[#7a1519] text-white p-2 rounded-full shadow-lg transition-all z-50"
                  >
                    <ChevronDownIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-[#901b20] transition-colors rounded-full hover:bg-gray-100">
                    <FaceSmileIcon className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-gray-50 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-[#901b20] text-white rounded-full hover:bg-[#7a1519] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#901b20] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaceSmileIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Chat
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a user or chat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Message Modal */}
      {editMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Edit Message
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 mb-4 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#901b20] bg-gray-50"
              placeholder="Type your message..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setEditMessage(null);
                  setEditText("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMessage}
                className="px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519] transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {confirmDelete.forEveryone
                  ? "Delete for Everyone?"
                  : "Delete for You?"}
              </h3>
              <p className="text-gray-600 text-sm">
                {confirmDelete.forEveryone
                  ? "This message will be removed for all participants."
                  : "This will only hide the message for you."}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

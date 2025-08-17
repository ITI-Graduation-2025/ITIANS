// // //src/app/chat/chatid/page.jsx
// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import {
// //   EllipsisHorizontalIcon,
// //   XMarkIcon,
// //   PaperAirplaneIcon,
// //   FaceSmileIcon,
// //   EllipsisVerticalIcon,
// //   ChevronDownIcon,
// //   ArrowLeftIcon,
// // } from "@heroicons/react/24/outline";
// // import {
// //   collection,
// //   query,
// //   orderBy,
// //   onSnapshot,
// //   doc,
// //   getDoc,
// //   addDoc,
// //   serverTimestamp,
// //   updateDoc,
// //   deleteDoc,
// //   getDocs,
// // } from "firebase/firestore";
// // import { db } from "@/config/firebase";
// // import useCurrentUser from "@/hooks/useCurrentUser";
// // import { formatDistanceToNow } from "date-fns";
// // import Loading from "@/app/chat/[chatId]/loading";
// // import { ensureChatDocument } from "@/lib/chatFunctions";

// // const generateBackgroundColor = (senderId) => {
// //   const colors = [
// //     "bg-red-500",
// //     "bg-blue-500",
// //     "bg-green-500",
// //     "bg-yellow-500",
// //     "bg-purple-500",
// //     "bg-pink-500",
// //     "bg-teal-500",
// //   ];
// //   const index = senderId.charCodeAt(0) % colors.length;
// //   return colors[index];
// // };

// // export default function ChatPage() {
// //   const { chatId } = useParams();
// //   const currentUser = useCurrentUser();
// //   const router = useRouter();

// //   const [selectedChatData, setSelectedChatData] = useState(null);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [showHeaderMenu, setShowHeaderMenu] = useState(false);
// //   const [showMessageMenu, setShowMessageMenu] = useState(null);
// //   const [messages, setMessages] = useState([]);
// //   const [userProfiles, setUserProfiles] = useState({});
// //   const [isTyping, setIsTyping] = useState(false);
// //   const [typingName, setTypingName] = useState("");
// //   const [editMessage, setEditMessage] = useState(null);
// //   const [editText, setEditText] = useState("");
// //   const [confirmDelete, setConfirmDelete] = useState(null);
// //   const [showScrollToBottom, setShowScrollToBottom] = useState(false);
// //   const [otherUser, setOtherUser] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const messagesEndRef = useRef(null);
// //   const messageRefs = useRef({});
// //   const messagesContainerRef = useRef(null);

// //   // Navigate to user profile
// //   const handleProfileClick = (user) => {
// //     if (user.role === "mentor") {
// //       router.push(`/mentor/${user.id}`);
// //     } else {
// //       router.push(`/profile?id=${user.id}`);
// //     }
// //   };

// //   // Close menus when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (!event.target.closest(".menu-container")) {
// //         setShowHeaderMenu(false);
// //         setShowMessageMenu(null);
// //       }
// //     };

// //     document.addEventListener("click", handleClickOutside);
// //     return () => document.removeEventListener("click", handleClickOutside);
// //   }, []);

// //   // Scroll handling
// //   useEffect(() => {
// //     const container = messagesContainerRef.current;
// //     if (!container) return;

// //     const handleScroll = () => {
// //       const { scrollTop, scrollHeight, clientHeight } = container;
// //       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
// //       setShowScrollToBottom(!isNearBottom && messages.length > 0);
// //     };

// //     container.addEventListener("scroll", handleScroll);
// //     return () => container.removeEventListener("scroll", handleScroll);
// //   }, [messages.length]);

// //   // Fetch chat data and ensure chat document exists
// //   useEffect(() => {
// //     if (!currentUser || !chatId) return;

// //     const initializeChat = async () => {
// //       try {
// //         setIsLoading(true);
// //         const otherUserId = chatId
// //           .split("_")
// //           .find((id) => id !== currentUser.uid);
// //         if (!otherUserId) {
// //           console.error("Invalid chatId format");
// //           setIsLoading(false);
// //           return;
// //         }

// //         // Ensure chat document exists with correct structure
// //         await ensureChatDocument(chatId, currentUser.uid, otherUserId);

// //         const chatRef = doc(db, "chats", chatId);
// //         const unsubscribe = onSnapshot(chatRef, async (chatDoc) => {
// //           if (!chatDoc.exists()) {
// //             console.log("Chat document does not exist");
// //             setIsLoading(false);
// //             return;
// //           }

// //           const data = chatDoc.data();
// //           setSelectedChatData(data);

// //           // Fetch other user data
// //           const userRef = doc(db, "users", otherUserId);
// //           const userSnap = await getDoc(userRef);
// //           if (userSnap.exists()) {
// //             const userData = userSnap.data();
// //             setOtherUser({
// //               id: otherUserId,
// //               name: userData.name || userData.displayName || "Unknown",
// //               profileImage: userData.profileImage || null,
// //               role: userData.role || "freelancer",
// //             });
// //           } else {
// //             setOtherUser({
// //               id: otherUserId,
// //               name: "Unknown",
// //               profileImage: null,
// //               role: "freelancer",
// //             });
// //           }
// //           setIsLoading(false);
// //         });

// //         return () => unsubscribe();
// //       } catch (error) {
// //         console.error("Error initializing chat:", error);
// //         setIsLoading(false);
// //       }
// //     };

// //     initializeChat();
// //   }, [currentUser, chatId]);

// //   // Listen to messages
// //   useEffect(() => {
// //     if (!chatId || !currentUser) return;

// //     const q = query(
// //       collection(db, "chats", chatId, "messages"),
// //       orderBy("createdAt", "asc"),
// //     );

// //     const unsubscribe = onSnapshot(q, async (snapshot) => {
// //       const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setMessages(msgs);

// //       // Mark messages as read
// //       const unreadMessages = msgs.filter(
// //         (msg) => msg.senderId !== currentUser.uid && !msg.read,
// //       );
// //       for (const msg of unreadMessages) {
// //         const messageRef = doc(db, "chats", chatId, "messages", msg.id);
// //         await updateDoc(messageRef, { read: true });
// //       }

// //       // Build user profiles
// //       const senderIds = [...new Set(msgs.map((msg) => msg.senderId))];
// //       const profiles = {};
// //       for (const senderId of senderIds) {
// //         const userRef = doc(db, "users", senderId);
// //         const userSnap = await getDoc(userRef);
// //         if (userSnap.exists()) {
// //           const userData = userSnap.data();
// //           const displayName =
// //             userData.displayName ||
// //             userData.name ||
// //             userData.username ||
// //             senderId ||
// //             "Unknown";
// //           profiles[senderId] = {
// //             profileImage: userData.profileImage || null,
// //             displayName: displayName,
// //             initial: (displayName || "U")[0].toUpperCase(),
// //             bgColor: generateBackgroundColor(senderId),
// //             role: userData.role || "freelancer",
// //             id: senderId,
// //           };
// //         }
// //       }
// //       setUserProfiles(profiles);
// //     });

// //     return () => unsubscribe();
// //   }, [chatId, currentUser]);

// //   // Listen to typing status
// //   useEffect(() => {
// //     if (!chatId || !currentUser) return;

// //     const chatRef = doc(db, "chats", chatId);
// //     const unsubscribe = onSnapshot(chatRef, (doc) => {
// //       if (!doc.exists()) return;

// //       const data = doc.data();
// //       setSelectedChatData(data);

// //       // Handle typing
// //       if (data?.typing && data.typing !== currentUser.uid) {
// //         setIsTyping(true);
// //         setTypingName(data.typingName || "Someone");
// //       } else {
// //         setIsTyping(false);
// //         setTypingName("");
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, [chatId, currentUser]);

// //   // Handle typing indicator
// //   useEffect(() => {
// //     if (!chatId || !currentUser) return;

// //     const chatRef = doc(db, "chats", chatId);
// //     const handleTyping = async () => {
// //       try {
// //         await updateDoc(chatRef, {
// //           typing: newMessage.trim() ? currentUser.uid : null,
// //           typingName: newMessage.trim() ? currentUser.name : null,
// //         });
// //       } catch (error) {
// //         console.error("Error updating typing status:", error);
// //       }
// //     };
// //     handleTyping();
// //   }, [newMessage, chatId, currentUser]);

// //   const scrollToBottom = () => {
// //     if (messagesContainerRef.current) {
// //       messagesContainerRef.current.scrollTo({
// //         top: messagesContainerRef.current.scrollHeight,
// //         behavior: "smooth",
// //       });
// //     }
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   const getDefaultAvatar = (role) => {
// //     return role === "mentor" ? "/default-avatar.avif" : "/default--avatar.avif";
// //   };

// //   const handleSendMessage = async () => {
// //     if (!newMessage.trim() || !chatId || !currentUser || !otherUser) return;

// //     try {
// //       // Add the message
// //       await addDoc(collection(db, "chats", chatId, "messages"), {
// //         senderId: currentUser.uid,
// //         senderName: currentUser.name,
// //         text: newMessage.trim(),
// //         createdAt: serverTimestamp(),
// //         read: false,
// //       });

// //       // Update last message in chat document
// //       const chatRef = doc(db, "chats", chatId);
// //       await updateDoc(chatRef, {
// //         lastMessage: newMessage.trim(),
// //         lastMessageAt: serverTimestamp(),
// //       });

// //       setNewMessage("");
// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const handleEditMessage = async () => {
// //     if (!editText.trim() || !editMessage) return;
// //     try {
// //       const messageRef = doc(db, "chats", chatId, "messages", editMessage.id);
// //       await updateDoc(messageRef, {
// //         text: editText.trim(),
// //         edited: true,
// //         updatedAt: serverTimestamp(),
// //       });

// //       // Update last message if this was the latest message
// //       const messagesRef = collection(db, "chats", chatId, "messages");
// //       const latestMessageQuery = query(
// //         messagesRef,
// //         orderBy("createdAt", "desc"),
// //         limit(1),
// //       );
// //       const latestMessageSnapshot = await getDocs(latestMessageQuery);
// //       if (
// //         !latestMessageSnapshot.empty &&
// //         latestMessageSnapshot.docs[0].id === editMessage.id
// //       ) {
// //         const chatRef = doc(db, "chats", chatId);
// //         await updateDoc(chatRef, {
// //           lastMessage: editText.trim(),
// //           lastMessageAt: serverTimestamp(),
// //         });
// //       }

// //       setEditMessage(null);
// //       setEditText("");
// //       setShowMessageMenu(null);
// //     } catch (error) {
// //       console.error("Error editing message:", error);
// //     }
// //   };

// //   const handleDeleteMessage = async () => {
// //     if (!confirmDelete) return;
// //     try {
// //       const messageRef = doc(
// //         db,
// //         "chats",
// //         chatId,
// //         "messages",
// //         confirmDelete.messageId,
// //       );
// //       if (confirmDelete.forEveryone) {
// //         await updateDoc(messageRef, {
// //           deletedForEveryone: true,
// //         });
// //       } else {
// //         await updateDoc(messageRef, {
// //           deleted: { [currentUser.uid]: true },
// //         });
// //       }

// //       // Update last message if the deleted message was the latest
// //       const messagesRef = collection(db, "chats", chatId, "messages");
// //       const latestMessageQuery = query(
// //         messagesRef,
// //         orderBy("createdAt", "desc"),
// //         limit(1),
// //       );
// //       const latestMessageSnapshot = await getDocs(latestMessageQuery);
// //       const chatRef = doc(db, "chats", chatId);
// //       if (
// //         !latestMessageSnapshot.empty &&
// //         latestMessageSnapshot.docs[0].id === confirmDelete.messageId
// //       ) {
// //         await updateDoc(chatRef, {
// //           lastMessage: "Message deleted",
// //           lastMessageAt: serverTimestamp(),
// //         });
// //       }

// //       setConfirmDelete(null);
// //       setShowMessageMenu(null);
// //     } catch (error) {
// //       console.error("Error deleting message:", error);
// //     }
// //   };

// //   const handleDeleteChat = async () => {
// //     try {
// //       // Delete all messages
// //       const messagesRef = collection(db, "chats", chatId, "messages");
// //       const messagesSnapshot = await getDocs(messagesRef);
// //       const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
// //         deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id)),
// //       );
// //       await Promise.all(deletePromises);

// //       // Delete the chat
// //       await deleteDoc(doc(db, "chats", chatId));

// //       router.push("/chat");
// //       setShowHeaderMenu(false);
// //     } catch (error) {
// //       console.error("Error deleting chat:", error);
// //     }
// //   };

// //   const isNearHeader = (msgId) => {
// //     const messageElement = messageRefs.current[msgId];
// //     if (messageElement) {
// //       const rect = messageElement.getBoundingClientRect();
// //       return rect.top < 200;
// //     }
// //     return false;
// //   };

// //   if (!currentUser || isLoading) {
// //     return <Loading />;
// //   }

// //   return (
// //     <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
// //       <div className="h-[85vh] w-full max-w-4xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
// //         {/* Chat Header */}
// //         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
// //           <div className="flex items-center gap-3">
// //             <button
// //               onClick={() => router.push("/chat")}
// //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
// //             </button>
// //             {otherUser && (
// //               <>
// //                 <div
// //                   className="cursor-pointer hover:scale-105 transition-transform"
// //                   onClick={() => handleProfileClick(otherUser)}
// //                 >
// //                   {otherUser.profileImage ? (
// //                     <img
// //                       src={otherUser.profileImage}
// //                       alt={otherUser.name}
// //                       className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                     />
// //                   ) : (
// //                     <img
// //                       src={getDefaultAvatar(otherUser.role)}
// //                       alt={otherUser.name}
// //                       className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                     />
// //                   )}
// //                 </div>
// //                 <div>
// //                   <h3 className="font-medium text-gray-900">
// //                     {otherUser.name}
// //                   </h3>
// //                   {isTyping && (
// //                     <p className="text-sm text-[#901b20] animate-pulse">
// //                       typing...
// //                     </p>
// //                   )}
// //                 </div>
// //               </>
// //             )}
// //             {!otherUser && !isLoading && (
// //               <div className="flex items-center gap-3">
// //                 <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
// //                 <div>
// //                   <h3 className="font-medium text-gray-900">Loading...</h3>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="menu-container">
// //               <button
// //                 onClick={() => setShowHeaderMenu(!showHeaderMenu)}
// //                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
// //               >
// //                 <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
// //                 {showHeaderMenu && (
// //                   <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 w-32">
// //                     <button
// //                       onClick={handleDeleteChat}
// //                       className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
// //                     >
// //                       Delete Chat
// //                     </button>
// //                   </div>
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Messages Container */}
// //         <div
// //           ref={messagesContainerRef}
// //           className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
// //         >
// //           {messages.length > 0 ? (
// //             messages.map((msg) => (
// //               <div
// //                 key={msg.id}
// //                 ref={(el) => (messageRefs.current[msg.id] = el)}
// //                 className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} items-start gap-2`}
// //               >
// //                 {msg.senderId !== currentUser.uid && (
// //                   <div
// //                     className="cursor-pointer hover:scale-105 transition-transform"
// //                     onClick={() => {
// //                       const userProfile = userProfiles[msg.senderId];
// //                       if (userProfile) {
// //                         handleProfileClick(userProfile);
// //                       }
// //                     }}
// //                   >
// //                     {userProfiles[msg.senderId]?.profileImage ? (
// //                       <img
// //                         src={userProfiles[msg.senderId].profileImage}
// //                         alt="Profile"
// //                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                       />
// //                     ) : (
// //                       <img
// //                         src={getDefaultAvatar(
// //                           userProfiles[msg.senderId]?.role || "freelancer",
// //                         )}
// //                         alt="Profile"
// //                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                       />
// //                     )}
// //                   </div>
// //                 )}

// //                 <div
// //                   className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
// //                     msg.senderId === currentUser.uid
// //                       ? "bg-[#901b20] text-white"
// //                       : "bg-white text-gray-900 border border-gray-200"
// //                   }`}
// //                 >
// //                   {(msg.deleted && msg.deleted[currentUser.uid]) ||
// //                   msg.deletedForEveryone ? (
// //                     <div className="italic text-sm text-gray-300 flex items-center gap-2">
// //                       This message was deleted
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <div className="text-sm">{msg.text}</div>
// //                       <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
// //                         <span>
// //                           {msg.createdAt
// //                             ? formatDistanceToNow(
// //                                 new Date(msg.createdAt.toDate()),
// //                                 { addSuffix: true },
// //                               )
// //                             : "Just now"}
// //                         </span>
// //                         {msg.edited && (
// //                           <span className="italic bg-black/10 px-1 py-0.5 rounded text-xs">
// //                             edited
// //                           </span>
// //                         )}
// //                       </div>
// //                     </>
// //                   )}
// //                 </div>

// //                 {msg.senderId === currentUser.uid &&
// //                   !msg.deleted?.[currentUser.uid] &&
// //                   !msg.deletedForEveryone && (
// //                     <div className="menu-container relative">
// //                       <button
// //                         onClick={() =>
// //                           setShowMessageMenu(
// //                             showMessageMenu === msg.id ? null : msg.id,
// //                           )
// //                         }
// //                         className="p-1 text-gray-500 hover:text-gray-600 hover:bg-white/20 rounded-full transition-all"
// //                       >
// //                         <EllipsisVerticalIcon className="h-4 w-4" />
// //                       </button>
// //                       {showMessageMenu === msg.id && (
// //                         <div
// //                           className={`absolute ${
// //                             isNearHeader(msg.id)
// //                               ? "top-0 right-[calc(100%+0.5rem)]"
// //                               : "top-[-1rem] right-6"
// //                           } bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-40 overflow-hidden`}
// //                         >
// //                           <button
// //                             onClick={() => {
// //                               setEditMessage(msg);
// //                               setEditText(msg.text);
// //                               setShowMessageMenu(null);
// //                             }}
// //                             className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
// //                           >
// //                             Edit
// //                           </button>
// //                           <button
// //                             onClick={() => {
// //                               setConfirmDelete({
// //                                 messageId: msg.id,
// //                                 forEveryone: false,
// //                               });
// //                               setShowMessageMenu(null);
// //                             }}
// //                             className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
// //                           >
// //                             Delete for Me
// //                           </button>
// //                           <button
// //                             onClick={() => {
// //                               setConfirmDelete({
// //                                 messageId: msg.id,
// //                                 forEveryone: true,
// //                               });
// //                               setShowMessageMenu(null);
// //                             }}
// //                             className="block w-full text-left px-3 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors"
// //                           >
// //                             Delete for Everyone
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   )}

// //                 {msg.senderId === currentUser.uid && (
// //                   <div
// //                     className="cursor-pointer hover:scale-105 transition-transform"
// //                     onClick={() => handleProfileClick(currentUser)}
// //                   >
// //                     {userProfiles[msg.senderId]?.profileImage ? (
// //                       <img
// //                         src={userProfiles[msg.senderId].profileImage}
// //                         alt="Profile"
// //                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                       />
// //                     ) : (
// //                       <img
// //                         src={getDefaultAvatar(
// //                           userProfiles[msg.senderId]?.role ||
// //                             currentUser.role ||
// //                             "freelancer",
// //                         )}
// //                         alt="Profile"
// //                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
// //                       />
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             ))
// //           ) : (
// //             <div className="flex items-center justify-center h-full">
// //               <div className="text-center">
// //                 <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
// //                   <FaceSmileIcon className="h-8 w-8 text-gray-400" />
// //                 </div>
// //                 <h3 className="text-lg font-medium text-gray-600 mb-2">
// //                   No messages yet
// //                 </h3>
// //                 <p className="text-gray-500 text-sm">Start the conversation!</p>
// //               </div>
// //             </div>
// //           )}
// //           <div ref={messagesEndRef} />

// //           {showScrollToBottom && (
// //             <button
// //               onClick={scrollToBottom}
// //               className="fixed bottom-20 right-8 bg-[#901b20] hover:bg-[#7a1519] text-white p-2 rounded-full shadow-lg transition-all z-50"
// //             >
// //               <ChevronDownIcon className="h-5 w-5" />
// //             </button>
// //           )}
// //         </div>

// //         {/* Message Input */}
// //         <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
// //           <div className="flex items-center gap-3">
// //             <button className="p-2 text-gray-400 hover:text-[#901b20] transition-colors rounded-full hover:bg-gray-100">
// //               <FaceSmileIcon className="h-5 w-5" />
// //             </button>
// //             <div className="flex-1 relative">
// //               <input
// //                 type="text"
// //                 value={newMessage}
// //                 onChange={(e) => setNewMessage(e.target.value)}
// //                 onKeyPress={handleKeyPress}
// //                 placeholder="Type a message..."
// //                 className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-gray-50 transition-all"
// //               />
// //             </div>
// //             <button
// //               onClick={handleSendMessage}
// //               disabled={!newMessage.trim()}
// //               className="p-2 bg-[#901b20] text-white rounded-full hover:bg-[#7a1519] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
// //             >
// //               <PaperAirplaneIcon className="h-5 w-5" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Edit Message Modal */}
// //       {editMessage && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
// //             <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
// //               Edit Message
// //             </h3>
// //             <textarea
// //               value={editText}
// //               onChange={(e) => setEditText(e.target.value)}
// //               className="w-full p-3 rounded-lg border border-gray-300 mb-4 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#901b20] bg-gray-50"
// //               placeholder="Type your message..."
// //             />
// //             <div className="flex gap-3 justify-end">
// //               <button
// //                 onClick={() => {
// //                   setEditMessage(null);
// //                   setEditText("");
// //                 }}
// //                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleEditMessage}
// //                 className="px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1519] transition-all"
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       {confirmDelete && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl">
// //             <div className="text-center mb-4">
// //               <h3 className="text-lg font-bold text-gray-900 mb-2">
// //                 {confirmDelete.forEveryone
// //                   ? "Delete for Everyone?"
// //                   : "Delete for You?"}
// //               </h3>
// //               <p className="text-gray-600 text-sm">
// //                 {confirmDelete.forEveryone
// //                   ? "This message will be removed for all participants."
// //                   : "This will only hide the message for you."}
// //               </p>
// //             </div>
// //             <div className="flex gap-3 justify-end">
// //               <button
// //                 onClick={() => setConfirmDelete(null)}
// //                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleDeleteMessage}
// //                 className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// //////////////////////////////
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   EllipsisHorizontalIcon,
//   XMarkIcon,
//   PaperAirplaneIcon,
//   FaceSmileIcon,
//   EllipsisVerticalIcon,
//   ChevronDownIcon,
//   ArrowLeftIcon,
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
//   getDocs,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import useCurrentUser from "@/hooks/useCurrentUser";
// import { formatDistanceToNow } from "date-fns";
// import Loading from "@/app/chat/[chatId]/loading";
// import { getOrCreateChatId } from "@/lib/chatFunctions";

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

// export default function ChatPage() {
//   const { chatId } = useParams();
//   const currentUser = useCurrentUser();
//   User = useCurrentUser();
//   const router = useRouter();

//   const [selectedChatData, setSelectedChatData] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [showHeaderMenu, setShowHeaderMenu] = useState(false);
//   const [showMessageMenu, setShowMessageMenu] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [userProfiles, setUserProfiles] = useState({});
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingName, setTypingName] = useState("");
//   const [editMessage, setEditMessage] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [showScrollToBottom, setShowScrollToBottom] = useState(false);
//   const [otherUser, setOtherUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

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
//         setShowHeaderMenu(false);
//         setShowMessageMenu(null);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Scroll handling
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

//   // Fetch chat data and validate chatId
//   useEffect(() => {
//     if (!currentUser || !chatId) return;

//     const initializeChat = async () => {
//       try {
//         setIsLoading(true);
//         const otherUserId = chatId
//           .split("_")
//           .find((id) => id !== currentUser.uid);
//         if (!otherUserId) {
//           console.error("Invalid chatId format");
//           setIsLoading(false);
//           router.push("/chat");
//           return;
//         }

//         // Validate and get consistent chatId
//         const correctChatId = await getOrCreateChatId(
//           currentUser.uid,
//           otherUserId,
//         );

//         // Redirect if chatId is not consistent
//         if (correctChatId !== chatId) {
//           console.log(`Redirecting from ${chatId} to ${correctChatId}`);
//           router.replace(`/chat/${correctChatId}`);
//           return;
//         }

//         const chatRef = doc(db, "chats", correctChatId);
//         const unsubscribe = onSnapshot(chatRef, async (chatDoc) => {
//           if (!chatDoc.exists()) {
//             console.warn(`Chat ${correctChatId} does not exist`);
//             setIsLoading(false);
//             router.push("/chat");
//             return;
//           }

//           const data = chatDoc.data();
//           setSelectedChatData(data);

//           // Fetch other user data
//           const userRef = doc(db, "users", otherUserId);
//           const userSnap = await getDoc(userRef);
//           if (userSnap.exists()) {
//             const userData = userSnap.data();
//             setOtherUser({
//               id: otherUserId,
//               name: userData.name || userData.displayName || "Unknown",
//               profileImage: userData.profileImage || null,
//               role: userData.role || "freelancer",
//             });
//           } else {
//             setOtherUser({
//               id: otherUserId,
//               name: "Unknown",
//               profileImage: null,
//               role: "freelancer",
//             });
//           }
//           setIsLoading(false);
//         });

//         return () => unsubscribe();
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//         setIsLoading(false);
//         router.push("/chat");
//       }
//     };

//     initializeChat();
//   }, [currentUser, chatId, router]);

//   // Listen to messages
//   useEffect(() => {
//     if (!chatId || !currentUser) return;

//     const chatRef = doc(db, "chats", chatId);
//     getDoc(chatRef)
//       .then((chatSnap) => {
//         if (!chatSnap.exists()) {
//           console.warn(`Chat ${chatId} does not exist`);
//           setMessages([]);
//           setIsLoading(false);
//           router.push("/chat");
//           return;
//         }

//         const q = query(
//           collection(db, "chats", chatId, "messages"),
//           orderBy("createdAt", "asc"),
//         );

//         const unsubscribe = onSnapshot(q, async (snapshot) => {
//           const msgs = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setMessages(msgs);

//           // Mark messages as read
//           const unreadMessages = msgs.filter(
//             (msg) => msg.senderId !== currentUser.uid && !msg.read,
//           );
//           for (const msg of unreadMessages) {
//             const messageRef = doc(db, "chats", chatId, "messages", msg.id);
//             const messageSnap = await getDoc(messageRef);
//             if (messageSnap.exists()) {
//               await updateDoc(messageRef, { read: true });
//             } else {
//               console.warn(
//                 `Message ${msg.id} does not exist in chat ${chatId}`,
//               );
//             }
//           }

//           // Build user profiles
//           const senderIds = [...new Set(msgs.map((msg) => msg.senderId))];
//           const profiles = {};
//           for (const senderId of senderIds) {
//             const userRef = doc(db, "users", senderId);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//               const userData = userSnap.data();
//               const displayName =
//                 userData.displayName ||
//                 userData.name ||
//                 userData.username ||
//                 senderId ||
//                 "Unknown";
//               profiles[senderId] = {
//                 profileImage: userData.profileImage || null,
//                 displayName: displayName,
//                 initial: (displayName || "U")[0].toUpperCase(),
//                 bgColor: generateBackgroundColor(senderId),
//                 role: userData.role || "freelancer",
//                 id: senderId,
//               };
//             }
//           }
//           setUserProfiles(profiles);
//         });

//         return () => unsubscribe();
//       })
//       .catch((error) => {
//         console.error("Error checking chat existence:", error);
//         setMessages([]);
//         setIsLoading(false);
//         router.push("/chat");
//       });
//   }, [chatId, currentUser, router]);

//   // Listen to typing status
//   useEffect(() => {
//     if (!chatId || !currentUser) return;

//     const chatRef = doc(db, "chats", chatId);
//     const unsubscribe = onSnapshot(chatRef, (doc) => {
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
//   }, [chatId, currentUser]);

//   // Handle typing indicator
//   useEffect(() => {
//     if (!chatId || !currentUser) return;

//     const chatRef = doc(db, "chats", chatId);
//     const handleTyping = async () => {
//       try {
//         await updateDoc(chatRef, {
//           typing: newMessage.trim() ? currentUser.uid : null,
//           typingName: newMessage.trim() ? currentUser.name : null,
//         });
//       } catch (error) {
//         console.error("Error updating typing status:", error);
//       }
//     };
//     handleTyping();
//   }, [newMessage, chatId, currentUser]);

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

//   const getDefaultAvatar = (role) => {
//     return role === "mentor" ? "/default-avatar.avif" : "/default--avatar.avif";
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !chatId || !currentUser || !otherUser) return;

//     try {
//       // Add the message
//       await addDoc(collection(db, "chats", chatId, "messages"), {
//         senderId: currentUser.uid,
//         senderName: currentUser.name,
//         text: newMessage.trim(),
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       // Update last message in chat document
//       const chatRef = doc(db, "chats", chatId);
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
//       const messageRef = doc(db, "chats", chatId, "messages", editMessage.id);
//       await updateDoc(messageRef, {
//         text: editText.trim(),
//         edited: true,
//         updatedAt: serverTimestamp(),
//       });

//       // Update last message if this was the latest message
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const latestMessageQuery = query(
//         messagesRef,
//         orderBy("createdAt", "desc"),
//         limit(1),
//       );
//       const latestMessageSnapshot = await getDocs(latestMessageQuery);
//       if (
//         !latestMessageSnapshot.empty &&
//         latestMessageSnapshot.docs[0].id === editMessage.id
//       ) {
//         const chatRef = doc(db, "chats", chatId);
//         await updateDoc(chatRef, {
//           lastMessage: editText.trim(),
//           lastMessageAt: serverTimestamp(),
//         });
//       }

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
//         chatId,
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

//       // Update last message if the deleted message was the latest
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const latestMessageQuery = query(
//         messagesRef,
//         orderBy("createdAt", "desc"),
//         limit(1),
//       );
//       const latestMessageSnapshot = await getDocs(latestMessageQuery);
//       const chatRef = doc(db, "chats", chatId);
//       if (
//         !latestMessageSnapshot.empty &&
//         latestMessageSnapshot.docs[0].id === confirmDelete.messageId
//       ) {
//         await updateDoc(chatRef, {
//           lastMessage: "Message deleted",
//           lastMessageAt: serverTimestamp(),
//         });
//       }

//       setConfirmDelete(null);
//       setShowMessageMenu(null);
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   };

//   const handleDeleteChat = async () => {
//     try {
//       // Delete all messages
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const messagesSnapshot = await getDocs(messagesRef);
//       const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
//         deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id)),
//       );
//       await Promise.all(deletePromises);

//       // Delete the chat
//       await deleteDoc(doc(db, "chats", chatId));

//       router.push("/chat");
//       setShowHeaderMenu(false);
//     } catch (error) {
//       console.error("Error deleting chat:", error);
//     }
//   };

//   const isNearHeader = (msgId) => {
//     const messageElement = messageRefs.current[msgId];
//     if (messageElement) {
//       const rect = messageElement.getBoundingClientRect();
//       return rect.top < 200;
//     }
//     return false;
//   };

//   if (!currentUser || isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
//       <div className="h-[85vh] w-full max-w-4xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
//         {/* Chat Header */}
//         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => router.push("/chat")}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
//             </button>
//             {otherUser && (
//               <>
//                 <div
//                   className="cursor-pointer hover:scale-105 transition-transform"
//                   onClick={() => handleProfileClick(otherUser)}
//                 >
//                   {otherUser.profileImage ? (
//                     <img
//                       src={otherUser.profileImage}
//                       alt={otherUser.name}
//                       className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                     />
//                   ) : (
//                     <img
//                       src={getDefaultAvatar(otherUser.role)}
//                       alt={otherUser.name}
//                       className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">
//                     {otherUser.name}
//                   </h3>
//                   {isTyping && (
//                     <p className="text-sm text-[#901b20] animate-pulse">
//                       typing...
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}
//             {!otherUser && !isLoading && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">Loading...</h3>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="menu-container">
//               <button
//                 onClick={() => setShowHeaderMenu(!showHeaderMenu)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
//               >
//                 <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
//                 {showHeaderMenu && (
//                   <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 w-32">
//                     <button
//                       onClick={handleDeleteChat}
//                       className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
//                     >
//                       Delete Chat
//                     </button>
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Messages Container */}
//         <div
//           ref={messagesContainerRef}
//           className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
//         >
//           {messages.length > 0 ? (
//             messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 ref={(el) => (messageRefs.current[msg.id] = el)}
//                 className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} items-start gap-2`}
//               >
//                 {msg.senderId !== currentUser.uid && (
//                   <div
//                     className="cursor-pointer hover:scale-105 transition-transform"
//                     onClick={() => {
//                       const userProfile = userProfiles[msg.senderId];
//                       if (userProfile) {
//                         handleProfileClick(userProfile);
//                       }
//                     }}
//                   >
//                     {userProfiles[msg.senderId]?.profileImage ? (
//                       <img
//                         src={userProfiles[msg.senderId].profileImage}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                       />
//                     ) : (
//                       <img
//                         src={getDefaultAvatar(
//                           userProfiles[msg.senderId]?.role || "freelancer",
//                         )}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                       />
//                     )}
//                   </div>
//                 )}

//                 <div
//                   className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
//                     msg.senderId === currentUser.uid
//                       ? "bg-[#901b20] text-white"
//                       : "bg-white text-gray-900 border border-gray-200"
//                   }`}
//                 >
//                   {(msg.deleted && msg.deleted[currentUser.uid]) ||
//                   msg.deletedForEveryone ? (
//                     <div className="italic text-sm text-gray-300 flex items-center gap-2">
//                       This message was deleted
//                     </div>
//                   ) : (
//                     <>
//                       <div className="text-sm">{msg.text}</div>
//                       <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
//                         <span>
//                           {msg.createdAt
//                             ? formatDistanceToNow(
//                                 new Date(msg.createdAt.toDate()),
//                                 { addSuffix: true },
//                               )
//                             : "Just now"}
//                         </span>
//                         {msg.edited && (
//                           <span className="italic bg-black/10 px-1 py-0.5 rounded text-xs">
//                             edited
//                           </span>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {msg.senderId === currentUser.uid &&
//                   !msg.deleted?.[currentUser.uid] &&
//                   !msg.deletedForEveryone && (
//                     <div className="menu-container relative">
//                       <button
//                         onClick={() =>
//                           setShowMessageMenu(
//                             showMessageMenu === msg.id ? null : msg.id,
//                           )
//                         }
//                         className="p-1 text-gray-500 hover:text-gray-600 hover:bg-white/20 rounded-full transition-all"
//                       >
//                         <EllipsisVerticalIcon className="h-4 w-4" />
//                       </button>
//                       {showMessageMenu === msg.id && (
//                         <div
//                           className={`absolute ${
//                             isNearHeader(msg.id)
//                               ? "top-0 right-[calc(100%+0.5rem)]"
//                               : "top-[-1rem] right-6"
//                           } bg-white border border-gray-200 rounded-lg shadow-xl z-[100] w-40 overflow-hidden`}
//                         >
//                           <button
//                             onClick={() => {
//                               setEditMessage(msg);
//                               setEditText(msg.text);
//                               setShowMessageMenu(null);
//                             }}
//                             className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => {
//                               setConfirmDelete({
//                                 messageId: msg.id,
//                                 forEveryone: false,
//                               });
//                               setShowMessageMenu(null);
//                             }}
//                             className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
//                           >
//                             Delete for Me
//                           </button>
//                           <button
//                             onClick={() => {
//                               setConfirmDelete({
//                                 messageId: msg.id,
//                                 forEveryone: true,
//                               });
//                               setShowMessageMenu(null);
//                             }}
//                             className="block w-full text-left px-3 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors"
//                           >
//                             Delete for Everyone
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                 {msg.senderId === currentUser.uid && (
//                   <div
//                     className="cursor-pointer hover:scale-105 transition-transform"
//                     onClick={() => handleProfileClick(currentUser)}
//                   >
//                     {userProfiles[msg.senderId]?.profileImage ? (
//                       <img
//                         src={userProfiles[msg.senderId].profileImage}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                       />
//                     ) : (
//                       <img
//                         src={getDefaultAvatar(
//                           userProfiles[msg.senderId]?.role ||
//                             currentUser.role ||
//                             "freelancer",
//                         )}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
//                       />
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
//                   <FaceSmileIcon className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-600 mb-2">
//                   No messages yet
//                 </h3>
//                 <p className="text-gray-500 text-sm">Start the conversation!</p>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />

//           {showScrollToBottom && (
//             <button
//               onClick={scrollToBottom}
//               className="fixed bottom-20 right-8 bg-[#901b20] hover:bg-[#7a1519] text-white p-2 rounded-full shadow-lg transition-all z-50"
//             >
//               <ChevronDownIcon className="h-5 w-5" />
//             </button>
//           )}
//         </div>

//         {/* Message Input */}
//         <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <button className="p-2 text-gray-400 hover:text-[#901b20] transition-colors rounded-full hover:bg-gray-100">
//               <FaceSmileIcon className="h-5 w-5" />
//             </button>
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type a message..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-gray-50 transition-all"
//               />
//             </div>
//             <button
//               onClick={handleSendMessage}
//               disabled={!newMessage.trim()}
//               className="p-2 bg-[#901b20] text-white rounded-full hover:bg-[#7a1519] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
//             >
//               <PaperAirplaneIcon className="h-5 w-5" />
//             </button>
//           </div>
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
/////////////////////////////////
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  EllipsisHorizontalIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
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
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { formatDistanceToNow } from "date-fns";
import Loading from "@/app/chat/[chatId]/loading";
import { getOrCreateChatId } from "@/lib/chatFunctions";

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

export default function ChatPage() {
  const { chatId } = useParams();
  const currentUser = useCurrentUser();
  const router = useRouter();

  const [selectedChatData, setSelectedChatData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState("");
  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setShowHeaderMenu(false);
        setShowMessageMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Scroll handling
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

  // Fetch chat data and validate chatId
  useEffect(() => {
    if (!currentUser || !chatId) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const otherUserId = chatId
          .split("_")
          .find((id) => id !== currentUser.uid);
        if (!otherUserId) {
          console.error("Invalid chatId format");
          setIsLoading(false);
          router.push("/chat");
          return;
        }

        // Validate and get consistent chatId
        const correctChatId = await getOrCreateChatId(
          currentUser.uid,
          otherUserId,
        );

        // Redirect if chatId is not consistent
        if (correctChatId !== chatId) {
          console.log(`Redirecting from ${chatId} to ${correctChatId}`);
          router.replace(`/chat/${correctChatId}`);
          return;
        }

        const chatRef = doc(db, "chats", correctChatId);
        const unsubscribe = onSnapshot(chatRef, async (chatDoc) => {
          if (!chatDoc.exists()) {
            console.warn(`Chat ${correctChatId} does not exist`);
            setIsLoading(false);
            router.push("/chat");
            return;
          }

          const data = chatDoc.data();
          setSelectedChatData(data);

          // Fetch other user data
          const userRef = doc(db, "users", otherUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setOtherUser({
              id: otherUserId,
              name: userData.name || userData.displayName || "Unknown",
              profileImage: userData.profileImage || null,
              role: userData.role || "freelancer",
            });
          } else {
            setOtherUser({
              id: otherUserId,
              name: "Unknown",
              profileImage: null,
              role: "freelancer",
            });
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing chat:", error);
        setIsLoading(false);
        router.push("/chat");
      }
    };

    initializeChat();
  }, [currentUser, chatId, router]);

  // Listen to messages
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const chatRef = doc(db, "chats", chatId);
    getDoc(chatRef)
      .then((chatSnap) => {
        if (!chatSnap.exists()) {
          console.warn(`Chat ${chatId} does not exist`);
          setMessages([]);
          setIsLoading(false);
          router.push("/chat");
          return;
        }

        const q = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("createdAt", "asc"),
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(msgs);

          // Mark messages as read
          const unreadMessages = msgs.filter(
            (msg) => msg.senderId !== currentUser.uid && !msg.read,
          );
          for (const msg of unreadMessages) {
            const messageRef = doc(db, "chats", chatId, "messages", msg.id);
            const messageSnap = await getDoc(messageRef);
            if (messageSnap.exists()) {
              await updateDoc(messageRef, { read: true });
            } else {
              console.warn(
                `Message ${msg.id} does not exist in chat ${chatId}`,
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
        setIsLoading(false);
        router.push("/chat");
      });
  }, [chatId, currentUser, router]);

  // Listen to typing status
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
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
  }, [chatId, currentUser]);

  // Handle typing indicator
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const chatRef = doc(db, "chats", chatId);
    const handleTyping = async () => {
      try {
        await updateDoc(chatRef, {
          typing: newMessage.trim() ? currentUser.uid : null,
          typingName: newMessage.trim() ? currentUser.name : null,
        });
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    };
    handleTyping();
  }, [newMessage, chatId, currentUser]);

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

  const getDefaultAvatar = (role) => {
    return role === "mentor" ? "/default-avatar.avif" : "/default--avatar.avif";
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !currentUser || !otherUser) return;

    try {
      // Add the message
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: currentUser.uid,
        senderName: currentUser.name,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });

      // Update last message in chat document
      const chatRef = doc(db, "chats", chatId);
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
      const messageRef = doc(db, "chats", chatId, "messages", editMessage.id);
      await updateDoc(messageRef, {
        text: editText.trim(),
        edited: true,
        updatedAt: serverTimestamp(),
      });

      // Update last message if this was the latest message
      const messagesRef = collection(db, "chats", chatId, "messages");
      const latestMessageQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(1),
      );
      const latestMessageSnapshot = await getDocs(latestMessageQuery);
      if (
        !latestMessageSnapshot.empty &&
        latestMessageSnapshot.docs[0].id === editMessage.id
      ) {
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          lastMessage: editText.trim(),
          lastMessageAt: serverTimestamp(),
        });
      }

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
        chatId,
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

      // Update last message if the deleted message was the latest
      const messagesRef = collection(db, "chats", chatId, "messages");
      const latestMessageQuery = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(1),
      );
      const latestMessageSnapshot = await getDocs(latestMessageQuery);
      const chatRef = doc(db, "chats", chatId);
      if (
        !latestMessageSnapshot.empty &&
        latestMessageSnapshot.docs[0].id === confirmDelete.messageId
      ) {
        await updateDoc(chatRef, {
          lastMessage: "Message deleted",
          lastMessageAt: serverTimestamp(),
        });
      }

      setConfirmDelete(null);
      setShowMessageMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      // Delete all messages
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      const deletePromises = messagesSnapshot.docs.map((messageDoc) =>
        deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id)),
      );
      await Promise.all(deletePromises);

      // Delete the chat
      await deleteDoc(doc(db, "chats", chatId));

      router.push("/chat");
      setShowHeaderMenu(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const isNearHeader = (msgId) => {
    const messageElement = messageRefs.current[msgId];
    if (messageElement) {
      const rect = messageElement.getBoundingClientRect();
      return rect.top < 200;
    }
    return false;
  };

  if (!currentUser || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-2">
      <div className="h-[85vh] w-full max-w-4xl mx-auto bg-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/chat")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            {otherUser && (
              <>
                <div
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleProfileClick(otherUser)}
                >
                  {otherUser.profileImage ? (
                    <img
                      src={otherUser.profileImage}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                    />
                  ) : (
                    <img
                      src={getDefaultAvatar(otherUser.role)}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {otherUser.name}
                  </h3>
                  {isTyping && (
                    <p className="text-sm text-[#901b20] animate-pulse">
                      typing...
                    </p>
                  )}
                </div>
              </>
            )}
            {!otherUser && !isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Loading...</h3>
                </div>
              </div>
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
                      onClick={handleDeleteChat}
                      className="block w-full px-4 py-2 text-sm text-red-800 hover:bg-red-50 transition-colors text-left"
                    >
                      Delete Chat
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                ref={(el) => (messageRefs.current[msg.id] = el)}
                className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {msg.senderId !== currentUser.uid && (
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
                          userProfiles[msg.senderId]?.role || "freelancer",
                        )}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#901b20]/30 transition-all"
                      />
                    )}
                  </div>
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
                                { addSuffix: true },
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
                <p className="text-gray-500 text-sm">Start the conversation!</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

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

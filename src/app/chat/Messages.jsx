"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { getFunctions, httpsCallable } from "firebase/functions";

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

export default function Messages({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [editMessage, setEditMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const messagesContainerRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

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
          };
        } else {
          profiles[senderId] = {
            profileImage: null,
            displayName: senderId || "Unknown",
            initial: (senderId || "U")[0].toUpperCase(),
            bgColor: generateBackgroundColor(senderId),
          };
        }
      }
      setUserProfiles(profiles);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messagesContainerRef.current;
        setShowScrollButton(scrollTop + clientHeight < scrollHeight - 100);
      }
    };

    const container = messagesContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".message-menu")) {
        if (showMenu) {
          menuTimeoutRef.current = setTimeout(() => {
            setShowMenu(null);
          }, 300);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, [showMenu]);

  const isNearHeader = (msgId) => {
    const messageElement = messageRefs.current[msgId];
    if (messageElement && messagesContainerRef.current) {
      const containerRect =
        messagesContainerRef.current.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      return messageRect.top - containerRect.top < 100;
    }
    return false;
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleMenuClick = (messageId) => (event) => {
    event.stopPropagation();
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setShowMenu(showMenu === messageId ? null : messageId);
  };

  const updateLastMessage = async (chatId, isDeleted = false) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      if (isDeleted) {
        const q = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("createdAt", "desc"),
          limit(1),
        );
        const snapshot = await getDocs(q);
        const lastMsg = snapshot.docs[0]?.data();
        await updateDoc(chatRef, {
          lastMessage:
            lastMsg && !lastMsg.deletedForEveryone
              ? lastMsg.text
              : "Message deleted",
          lastMessageAt: lastMsg ? lastMsg.createdAt : new Date(),
        });
      } else {
        await updateDoc(chatRef, {
          lastMessage: editText.trim(),
          lastMessageAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating lastMessage:", error);
    }
  };

  const sendNotification = async (chatId, messageId) => {
    try {
      const functions = getFunctions();
      const sendMessageNotification = httpsCallable(
        functions,
        "sendMessageNotification",
      );
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);
      const participants = chatSnap
        .data()
        .participants.filter((uid) => uid !== currentUserId);
      await sendMessageNotification({
        recipientIds: participants,
        message: "A message was deleted for everyone.",
        chatId,
        messageId,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleEditMessage = async () => {
    if (!editText.trim() || !editMessage) return;
    try {
      const messageRef = doc(db, "chats", chatId, "messages", editMessage.id);
      await updateDoc(messageRef, {
        text: editText.trim(),
        edited: true,
        updatedAt: new Date(),
      });
      await updateLastMessage(chatId);
      setEditMessage(null);
      setEditText("");
      setShowMenu(null);
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
        await sendNotification(chatId, confirmDelete.messageId);
      } else {
        await updateDoc(messageRef, {
          deleted: { [currentUserId]: true },
        });
      }
      await updateLastMessage(chatId, true);
      setConfirmDelete(null);
      setShowMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="relative overflow-visible">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
      <div
        ref={messagesContainerRef}
        className="space-y-4 p-4 max-h-[calc(80vh-120px)] overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            ref={(el) => (messageRefs.current[msg.id] = el)}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            } items-start gap-2 relative ${index === messages.length - 1 ? "mb-6" : ""}`}
          >
            {msg.senderId !== currentUserId &&
              (userProfiles[msg.senderId]?.profileImage ? (
                <img
                  src={userProfiles[msg.senderId].profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold ${userProfiles[msg.senderId]?.bgColor}`}
                >
                  {userProfiles[msg.senderId]?.initial}
                </div>
              ))}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                msg.senderId === currentUserId
                  ? "bg-red-700 text-white ml-4"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mr-4"
              }`}
            >
              {(msg.deleted && msg.deleted[currentUserId]) ||
              msg.deletedForEveryone ? (
                <div className="italic text-sm text-gray-500">
                  This message was deleted
                </div>
              ) : (
                <>
                  <div className="text-base">{msg.text}</div>
                  <div className="text-xs text-gray-300 mt-1 flex justify-between">
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
                    {msg.edited && <span className="italic">(edited)</span>}
                  </div>
                </>
              )}
            </div>
            {msg.senderId === currentUserId &&
              !msg.deleted?.[currentUserId] &&
              !msg.deletedForEveryone && (
                <div className="relative">
                  <button
                    onClick={handleMenuClick(msg.id)}
                    className="p-1 text-gray-500 hover:text-gray-600"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                  {showMenu === msg.id && (
                    <div
                      className={`message-menu absolute ${
                        isNearHeader(msg.id)
                          ? "top-0 right-[calc(100%+1rem)]"
                          : "top-[-1.5rem] right-8"
                      } bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-[100] w-48 animate-fade-in`}
                    >
                      <button
                        onClick={() => {
                          setEditMessage(msg);
                          setEditText(msg.text);
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete({
                            messageId: msg.id,
                            forEveryone: false,
                          });
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Delete for Me
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete({
                            messageId: msg.id,
                            forEveryone: true,
                          });
                          setShowMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Delete for Everyone
                      </button>
                    </div>
                  )}
                </div>
              )}
            {msg.senderId === currentUserId &&
              (userProfiles[msg.senderId]?.profileImage ? (
                <img
                  src={userProfiles[msg.senderId].profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-semibold ${userProfiles[msg.senderId]?.bgColor}`}
                >
                  {userProfiles[msg.senderId]?.initial}
                </div>
              ))}
          </div>
        ))}
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-16 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200"
        >
          <ChevronDownIcon className="h-6 w-6" />
        </button>
      )}
      {editMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 max-w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Your Message
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white mb-4 resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setEditMessage(null);
                  setEditText("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMessage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 max-w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {confirmDelete.forEveryone
                ? "Delete this message for everyone?"
                : "Delete this message for yourself?"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {confirmDelete.forEveryone
                ? "This action cannot be undone for all participants."
                : "This will only hide the message for you."}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all duration-200"
              >
                Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

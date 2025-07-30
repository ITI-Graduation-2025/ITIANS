//src/app/chat/SendBox.jsx
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function SendBox({ chatId, senderId, senderName }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    const handleTyping = async () => {
      if (text.trim()) {
        await updateDoc(chatRef, {
          typing: senderId,
          typingName: senderName,
        });
      } else {
        await updateDoc(chatRef, {
          typing: null,
          typingName: null,
        });
      }
    };
    handleTyping();
  }, [text, chatId, senderId, senderName]);

  const handleSend = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      senderName,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
      >
        <FaceSmileIcon className="h-6 w-6" />
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-2 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="auto" />
        </div>
      )}
      <input
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <button
        className="bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
        onClick={handleSend}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

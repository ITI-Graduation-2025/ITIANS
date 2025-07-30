//src/lib/chatFunctions.js

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

export const generateChatId = (user1Id, user2Id) => {
  // return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  return [user1Id, user2Id].sort().join("_");
};

export async function createChat(currentUserId, otherUserId) {
  const chatId = generateChatId(currentUserId, otherUserId);
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      lastMessage: "",
      typing: null,
    });
    console.log("Chat created with", otherUserId);
  } else {
    console.log("Chat already exists");
  }

  return chatId;
}

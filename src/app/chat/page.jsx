"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Link from "next/link";
// import useCurrentUser from "@/hooks/useCurrentUser";
import { generateChatId } from "@/lib/chatFunctions";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function ChatsList() {
  const currentUser = useCurrentUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(chats);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessageTimestamp", "desc"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const chatData = { id: doc.id, ...doc.data() };
          const otherUserId = chatData.participants.find(
            (u) => u !== currentUser.uid,
          );
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          const otherUserName = userDoc.exists()
            ? userDoc.data().name || otherUserId
            : "Unknown User";
          return { ...chatData, otherUserName, otherUserId };
        }),
      );
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p>Loading chats...</p>;

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat.id}>
              <Link
                href={`/chat/${generateChatId(currentUser.uid, chat.otherUserId)}`} // ✅ أهم تعديل
              >
                Chat with {chat.otherUserName}
                {chat.lastMessage && (
                  <span> - Last: {chat.lastMessage.substring(0, 20)}...</span>
                )}
              </Link>
            </li>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </ul>
    </div>
  );
}

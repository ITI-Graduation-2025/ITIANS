import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function useChatLogic(chatId) {
  const currentUser = useCurrentUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب الرسائل الحية
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  // إرسال رسالة
  const sendMessage = useCallback(
    async (text) => {
      if (!currentUser || !chatId || !text.trim()) return;

      const msg = {
        text,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "chats", chatId, "messages"), msg);
    },
    [chatId, currentUser],
  );

  return {
    messages,
    sendMessage,
    loading,
  };
}

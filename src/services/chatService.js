// // import { db } from "@/config/firebase";
// // import {
// //   collection,
// //   addDoc,
// //   doc,
// //   getDoc,
// //   getDocs,
// //   query,
// //   where,
// //   orderBy,
// //   serverTimestamp,
// // } from "firebase/firestore";
// // import { onSnapshot } from "firebase/firestore";

// // // Fetch messages of a chat
// // export const fetchMessages = async (chatId) => {
// //   const messagesRef = collection(db, `chat/${chatId}/messages`);
// //   const q = query(messagesRef, orderBy("timestamp", "asc"));
// //   const querySnapshot = await getDocs(q);

// //   return querySnapshot.docs.map((doc) => ({
// //     id: doc.id,
// //     ...doc.data(),
// //   }));
// // };

// // // Send a new message
// // export const sendMessage = async (chatId, senderId, text) => {
// //   const messagesRef = collection(db, `chat/${chatId}/messages`);

// //   const newMessage = {
// //     senderId,
// //     text,
// //     timestamp: serverTimestamp(),
// //     status: "sent", // إضافة status للرسائل
// //   };

// //   await addDoc(messagesRef, newMessage);

// //   // تحديث lastMessage في الشات
// //   const chatRef = doc(db, "chats", chatId);
// //   await updateDoc(chatRef, {
// //     lastMessage: text,
// //     lastMessageTimestamp: serverTimestamp(),
// //   });
// // };

// // // Fetch all chats for the current user
// // export const fetchUserChats = async (currentUserId) => {
// //   const chatsRef = collection(db, "chats");
// //   const q = query(
// //     chatsRef,
// //     where("participants", "array-contains", currentUserId),
// //     orderBy("lastMessageTimestamp", "desc"),
// //   );

// //   const snapshot = await getDocs(q);
// //   return snapshot.docs.map((doc) => ({
// //     id: doc.id,
// //     ...doc.data(),
// //   }));
// // };

// // // Fetch chat details by chatId
// // export const fetchChatDetails = async (chatId) => {
// //   const chatRef = doc(db, "chats", chatId);
// //   const chatSnap = await getDoc(chatRef);

// //   if (chatSnap.exists()) {
// //     return { id: chatSnap.id, ...chatSnap.data() };
// //   }
// //   return null;
// // };

// // // Subscribe to real-time messages
// // export const subscribeToMessages = (chatId, callback) => {
// //   const messagesRef = collection(db, `chat/${chatId}/messages`);
// //   const q = query(messagesRef, orderBy("timestamp", "asc"));

// //   return onSnapshot(q, (snapshot) => {
// //     const messages = snapshot.docs.map((doc) => ({
// //       id: doc.id,
// //       ...doc.data(),
// //     }));
// //     callback(messages);
// //   });
// // };
// import { db } from "@/config/firebase";
// import {
//   collection,
//   addDoc,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { onSnapshot } from "firebase/firestore";

// // Fetch messages of a chat
// export const fetchMessages = async (chatId) => {
//   const messagesRef = collection(db, `chat/${chatId}/messages`);
//   const q = query(messagesRef, orderBy("timestamp", "asc"));
//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };

// // Send a new message
// export const sendMessage = async (chatId, senderId, text) => {
//   const messagesRef = collection(db, `chat/${chatId}/messages`);

//   const newMessage = {
//     senderId,
//     text,
//     timestamp: serverTimestamp(),
//     status: "sent", // إضافة status للرسائل
//   };

//   await addDoc(messagesRef, newMessage);

//   // تحديث lastMessage في الشات
//   const chatRef = doc(db, "chats", chatId);
//   await updateDoc(chatRef, {
//     lastMessage: text,
//     lastMessageTimestamp: serverTimestamp(),
//   });
// };

// // Fetch all chats for the current user
// export const fetchUserChats = async (currentUserId) => {
//   const chatsRef = collection(db, "chats");
//   const q = query(
//     chatsRef,
//     where("participants", "array-contains", currentUserId),
//     orderBy("lastMessageTimestamp", "desc"),
//   );

//   const snapshot = await getDocs(q);
//   const chats = [];

//   for (const docSnap of snapshot.docs) {
//     const chatData = docSnap.data();
//     const otherUserId = chatData.participants.find(
//       (id) => id !== currentUserId,
//     );

//     const userDoc = await getDoc(doc(db, "users", otherUserId));
//     const otherUser = userDoc.exists() ? userDoc.data() : null;

//     chats.push({
//       id: docSnap.id,
//       ...chatData,
//       otherUserName: otherUser?.name || "Unknown",
//       otherUserImage: otherUser?.profileImage || "", // هنا استبدلنا avatar بـ profileImage
//     });
//   }

//   return chats;
// };

// // Fetch chat details by chatId
// export const fetchChatDetails = async (chatId) => {
//   const chatRef = doc(db, "chats", chatId);
//   const chatSnap = await getDoc(chatRef);

//   if (chatSnap.exists()) {
//     return { id: chatSnap.id, ...chatSnap.data() };
//   }
//   return null;
// };

// // Subscribe to real-time messages
// export const subscribeToMessages = (chatId, callback) => {
//   const messagesRef = collection(db, `chat/${chatId}/messages`);
//   const q = query(messagesRef, orderBy("timestamp", "asc"));

//   return onSnapshot(q, (snapshot) => {
//     const messages = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(messages);
//   });
// };
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

// Fetch messages of a chat
export const fetchMessages = async (chatId) => {
  const messagesRef = collection(db, `chat/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Send a new message
export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, `chat/${chatId}/messages`);

  // ⬇️ Get sender's profile image
  const senderRef = doc(db, "users", senderId);
  const senderSnap = await getDoc(senderRef);
  const senderData = senderSnap.exists() ? senderSnap.data() : {};

  const newMessage = {
    senderId,
    text,
    timestamp: serverTimestamp(),
    status: "sent",
    profileImage: senderData.profileImage || "", // ⬅️ corrected here
  };

  await addDoc(messagesRef, newMessage);

  // تحديث lastMessage في الشات
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageTimestamp: serverTimestamp(),
  });
};

// Fetch all chats for the current user
export const fetchUserChats = async (currentUserId) => {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", currentUserId),
    orderBy("lastMessageTimestamp", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch chat details by chatId
export const fetchChatDetails = async (chatId) => {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    return { id: chatSnap.id, ...chatSnap.data() };
  }
  return null;
};

// Subscribe to real-time messages
export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, `chat/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

// get all chats
export const getAllChats = async () => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, orderBy("lastMessageTimestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

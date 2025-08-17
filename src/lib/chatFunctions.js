// ////////////////////////////////////
// // src/lib/chatFunctions.js
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   serverTimestamp,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";

// export const generateChatId = (userId1, userId2) => {
//   // Sort user IDs to ensure consistent chat ID regardless of order
//   const sortedIds = [userId1, userId2].sort();
//   return `${sortedIds[0]}_${sortedIds[1]}`;
// };

// export const createChat = async (currentUserId, otherUserId) => {
//   try {
//     const chatId = generateChatId(currentUserId, otherUserId);

//     // Check if chat already exists
//     const chatRef = doc(db, "chats", chatId);
//     const chatSnap = await getDoc(chatRef);

//     if (chatSnap.exists()) {
//       // Chat exists, make sure it has the right structure
//       const chatData = chatSnap.data();

//       // Update if missing required fields
//       const updates = {};
//       if (!chatData.participants || chatData.participants.length !== 2) {
//         updates.participants = [currentUserId, otherUserId];
//       }
//       if (!chatData.lastMessageAt) {
//         updates.lastMessageAt = serverTimestamp();
//       }
//       if (chatData.typing === undefined) {
//         updates.typing = null;
//         updates.typingName = null;
//       }

//       // Apply updates if needed
//       if (Object.keys(updates).length > 0) {
//         await updateDoc(chatRef, updates);
//       }

//       return chatId;
//     }

//     // Create new chat with all required fields
//     await setDoc(chatRef, {
//       participants: [currentUserId, otherUserId],
//       createdAt: serverTimestamp(),
//       lastMessage: "",
//       lastMessageAt: serverTimestamp(),
//       typing: null,
//       typingName: null,
//     });

//     console.log("New chat created:", chatId);
//     return chatId;
//   } catch (error) {
//     console.error("Error creating/accessing chat:", error);
//     throw error;
//   }
// };

// // Helper function to ensure a chat document has all required fields
// export const ensureChatDocument = async (
//   chatId,
//   currentUserId,
//   otherUserId,
// ) => {
//   try {
//     const chatRef = doc(db, "chats", chatId);
//     const chatSnap = await getDoc(chatRef);

//     if (!chatSnap.exists()) {
//       // Create the chat document if it doesn't exist
//       await setDoc(chatRef, {
//         participants: [currentUserId, otherUserId],
//         createdAt: serverTimestamp(),
//         lastMessage: "",
//         lastMessageAt: serverTimestamp(),
//         typing: null,
//         typingName: null,
//       });
//       console.log("Chat document created:", chatId);
//       return true;
//     }

//     // Check if document has all required fields
//     const chatData = chatSnap.data();
//     const updates = {};

//     if (!chatData.participants) {
//       updates.participants = [currentUserId, otherUserId];
//     }
//     if (!chatData.lastMessageAt) {
//       updates.lastMessageAt = serverTimestamp();
//     }
//     if (chatData.typing === undefined) {
//       updates.typing = null;
//       updates.typingName = null;
//     }

//     // Apply updates if needed
//     if (Object.keys(updates).length > 0) {
//       await updateDoc(chatRef, updates);
//       console.log("Chat document updated with missing fields:", chatId);
//     }

//     return true;
//   } catch (error) {
//     console.error("Error ensuring chat document:", error);
//     throw error;
//   }
// };

// // Function to safely update typing status
// export const updateTypingStatus = async (
//   chatId,
//   userId,
//   userName,
//   isTyping,
// ) => {
//   try {
//     const chatRef = doc(db, "chats", chatId);

//     // Check if document exists
//     const chatSnap = await getDoc(chatRef);
//     if (!chatSnap.exists()) {
//       console.error(
//         "Cannot update typing status: chat document does not exist",
//       );
//       return false;
//     }

//     const updates = isTyping
//       ? {
//           typing: userId,
//           typingName: userName || "Someone",
//         }
//       : {
//           typing: null,
//           typingName: null,
//         };

//     await updateDoc(chatRef, updates);
//     return true;
//   } catch (error) {
//     console.error("Error updating typing status:", error);
//     return false;
//   }
// };

// // Function to get chat participants from chatId
// export const parseChatParticipants = (chatId) => {
//   if (typeof chatId !== "string" || !chatId.includes("_")) {
//     return null;
//   }

//   const participants = chatId.split("_");
//   if (participants.length !== 2) {
//     return null;
//   }

//   return participants;
// };

// // Function to get the other user ID from a chat
// export const getOtherUserId = (chatId, currentUserId) => {
//   const participants = parseChatParticipants(chatId);
//   if (!participants) {
//     return null;
//   }

//   return participants.find((id) => id !== currentUserId) || null;
// };

// // Updated function that ALWAYS uses the consistent chatId format
// export const getOrCreateChatId = async (currentUserId, otherUserId) => {
//   try {
//     // ALWAYS generate the consistent chatId first
//     const consistentChatId = generateChatId(currentUserId, otherUserId);

//     // Check if this chat already exists in Firestore
//     const chatRef = doc(db, "chats", consistentChatId);
//     const chatSnap = await getDoc(chatRef);

//     if (chatSnap.exists()) {
//       // Chat exists, return the consistent ID
//       return consistentChatId;
//     }

//     // If it doesn't exist, try to find it using the old query method
//     // This handles legacy chats that might have been created differently
//     const q = query(
//       collection(db, "chats"),
//       where("participants", "array-contains", currentUserId),
//     );

//     const querySnapshot = await getDocs(q);
//     let existingChatId = null;

//     for (const docSnap of querySnapshot.docs) {
//       const chatData = docSnap.data();
//       if (
//         chatData.participants &&
//         chatData.participants.includes(otherUserId) &&
//         chatData.participants.length === 2
//       ) {
//         existingChatId = docSnap.id;
//         break;
//       }
//     }

//     if (existingChatId && existingChatId !== consistentChatId) {
//       // Found an existing chat with different ID, migrate it to consistent format
//       console.log(
//         `Migrating chat from ${existingChatId} to ${consistentChatId}`,
//       );

//       // Get existing chat data
//       const existingChatRef = doc(db, "chats", existingChatId);
//       const existingChatSnap = await getDoc(existingChatRef);
//       const existingData = existingChatSnap.data();

//       // Create new chat with consistent ID
//       await setDoc(chatRef, existingData);

//       // Copy all messages to new chat
//       const messagesRef = collection(db, "chats", existingChatId, "messages");
//       const messagesSnap = await getDocs(messagesRef);

//       for (const msgDoc of messagesSnap.docs) {
//         const msgData = msgDoc.data();
//         await addDoc(
//           collection(db, "chats", consistentChatId, "messages"),
//           msgData,
//         );
//       }

//       // Delete old chat and its messages (optional - you might want to keep for backup)
//       // await deleteDoc(existingChatRef);
//       // for (const msgDoc of messagesSnap.docs) {
//       //   await deleteDoc(msgDoc.ref);
//       // }

//       return consistentChatId;
//     }

//     if (existingChatId) {
//       return existingChatId;
//     }

//     // No existing chat found, create new one
//     return await createChat(currentUserId, otherUserId);
//   } catch (error) {
//     console.error("Error getting or creating chat:", error);
//     // Fallback to consistent format
//     return generateChatId(currentUserId, otherUserId);
//   }
// };

// // Function to navigate to chat - ensures consistent routing
// export const navigateToChat = (currentUserId, otherUserId, router) => {
//   const chatId = generateChatId(currentUserId, otherUserId);
//   router.push(`/chat/${chatId}`);
// };

// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   setDoc,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";

// // Generate a consistent chatId based on user IDs
// export const generateChatId = (userId1, userId2) => {
//   if (!userId1 || !userId2) {
//     throw new Error("Both user IDs are required to generate chatId");
//   }
//   return [userId1, userId2].sort().join("_");
// };

// // Create a new chat document
// export const createChat = async (chatId, userId1, userId2) => {
//   try {
//     const chatRef = doc(db, "chats", chatId);
//     const chatSnap = await getDoc(chatRef);

//     if (!chatSnap.exists()) {
//       await setDoc(chatRef, {
//         participants: [userId1, userId2],
//         lastMessage: "",
//         lastMessageAt: null,
//         typing: null,
//         typingName: null,
//         createdAt: new Date(),
//       });
//       return chatId;
//     }
//     return chatId;
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     throw new Error(`Failed to create chat: ${error.message}`);
//   }
// };

// // Get or create a chatId for two users
// export const getOrCreateChatId = async (userId1, userId2) => {
//   try {
//     if (!userId1 || !userId2) {
//       throw new Error("Both user IDs are required");
//     }

//     const chatId = generateChatId(userId1, userId2);
//     const chatRef = doc(db, "chats", chatId);
//     const chatSnap = await getDoc(chatRef);

//     if (chatSnap.exists()) {
//       return chatId;
//     }

//     // Create new chat if it doesn't exist
//     return await createChat(chatId, userId1, userId2);
//   } catch (error) {
//     console.error("Error in getOrCreateChatId:", error);
//     throw new Error(`Failed to get or create chatId: ${error.message}`);
//   }
// };

// // Navigate to a chat, creating it if it doesn't exist
// export const navigateToChat = async (currentUserId, otherUserId, router) => {
//   try {
//     if (!currentUserId || !otherUserId || !router) {
//       throw new Error("Missing required parameters for navigation");
//     }

//     const chatId = await getOrCreateChatId(currentUserId, otherUserId);
//     router.push(`/chat/${chatId}`);
//   } catch (error) {
//     console.error("Error navigating to chat:", error);
//     router.push("/chat"); // Fallback to main chat page on error
//   }
// };
/////////////////
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Generate a consistent chatId based on user IDs
export const generateChatId = (userId1, userId2) => {
  if (!userId1 || !userId2) {
    throw new Error("Both user IDs are required to generate chatId");
  }
  return [userId1, userId2].sort().join("_");
};

// Create a new chat document
export const createChat = async (chatId, userId1, userId2) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [userId1, userId2],
        lastMessage: "",
        lastMessageAt: null,
        typing: null,
        typingName: null,
        createdAt: new Date(),
      });
      return chatId;
    }
    return chatId;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error(`Failed to create chat: ${error.message}`);
  }
};

// Get or create a chatId for two users
export const getOrCreateChatId = async (userId1, userId2) => {
  try {
    if (!userId1 || !userId2) {
      throw new Error("Both user IDs are required");
    }

    const chatId = generateChatId(userId1, userId2);
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (chatSnap.exists()) {
      return chatId;
    }

    // Create new chat if it doesn't exist
    return await createChat(chatId, userId1, userId2);
  } catch (error) {
    console.error("Error in getOrCreateChatId:", error);
    throw new Error(`Failed to get or create chatId: ${error.message}`);
  }
};

// Start or select a chat without navigating
export const navigateToChat = async (currentUserId, otherUserId) => {
  try {
    if (!currentUserId || !otherUserId) {
      throw new Error("Missing required parameters for starting chat");
    }

    const chatId = await getOrCreateChatId(currentUserId, otherUserId);
    return chatId; // Return chatId instead of navigating
  } catch (error) {
    console.error("Error starting chat:", error);
    throw new Error(`Failed to start chat: ${error.message}`);
  }
};

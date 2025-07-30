//src/app/chat/ChatScreen.jsx
import Messages from "./Messages";
import SendBox from "./SendBox";
import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function ChatScreen({ chatId, currentUser }) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState("");
  const [otherUser, setOtherUser] = useState({
    name: "",
    profileImage: "/default--avatar.avif",
  });
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);

  useEffect(() => {
    console.log("Fetching initial data for chatId:", chatId);
    console.log("Current user:", currentUser);

    // Initial fetch for other user's data
    const fetchInitialData = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
          console.log("Chat document does not exist for chatId:", chatId);
          setOtherUser({
            name: "Chat Not Found",
            profileImage: "/default--avatar.avif",
          });
          setIsUserDataFetched(true);
          return;
        }

        const data = chatSnap.data();
        console.log("Initial chat data:", data);

        if (data?.participants) {
          const otherUserId = data.participants.find(
            (uid) => uid !== currentUser.uid,
          );
          console.log("Other user ID:", otherUserId);

          if (otherUserId) {
            const userRef = doc(db, "users", otherUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              console.log("Initial user data:", userData);
              setOtherUser({
                name:
                  userData.name && userData.name.trim()
                    ? userData.name
                    : "Unknown",
                profileImage: userData.profileImage || "/default--avatar.avif",
              });
            } else {
              console.log(
                "No user document found for otherUserId:",
                otherUserId,
              );
              setOtherUser({
                name: "Unknown",
                profileImage: "/default--avatar.avif",
              });
            }
          } else {
            console.log("No other user ID found in participants");
            setOtherUser({
              name: "Unknown",
              profileImage: "/default--avatar.avif",
            });
          }
        } else {
          console.log("No participants found in initial data");
          setOtherUser({
            name: "Unknown",
            profileImage: "/default--avatar.avif",
          });
        }
        setIsUserDataFetched(true);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setOtherUser({
          name: "Error Loading",
          profileImage: "/default--avatar.avif",
        });
        setIsUserDataFetched(true);
      }
    };

    fetchInitialData();

    // Set up real-time listener
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(
      chatRef,
      (doc) => {
        if (!doc.exists()) {
          console.log("Chat document no longer exists for chatId:", chatId);
          return;
        }

        const data = doc.data();
        console.log("Realtime chat data:", data);

        // Handle typing
        if (data?.typing && data.typing !== currentUser.uid) {
          setIsTyping(true);
          setTypingName(data.typingName || "Someone");
        } else {
          setIsTyping(false);
          setTypingName("");
        }
      },
      (error) => {
        console.error("Error in onSnapshot:", error);
      },
    );

    return () => unsubscribe();
  }, [chatId, currentUser.uid]);

  return (
    <div className="flex flex-col h-[80vh] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-900">
      {isUserDataFetched && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-red-800 dark:bg-gray-800 flex items-center gap-2">
          <img
            src={otherUser.profileImage || "/default--avatar.avif"}
            alt={otherUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold text-white dark:text-white">
            {otherUser.name || "Unknown"}
          </h2>
        </div>
      )}
      <div className="flex-1 relative">
        <Messages chatId={chatId} currentUserId={currentUser.uid} />
        {isTyping && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic px-4 absolute bottom-0">
            {typingName} is typing...
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <SendBox
          chatId={chatId}
          senderId={currentUser.uid}
          senderName={currentUser.name}
        />
      </div>
    </div>
  );
}

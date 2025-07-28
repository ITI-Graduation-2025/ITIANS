"use client";

import { useParams } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import ChatScreen from "../ChatScreen";

export default function ChatPage() {
  const { chatId } = useParams();
  const currentUser = useCurrentUser();

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ChatScreen chatId={chatId} currentUser={currentUser} />
    </div>
  );
}

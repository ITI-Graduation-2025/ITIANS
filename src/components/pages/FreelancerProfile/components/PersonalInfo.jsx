"use client";
import { FaEnvelope } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";

import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { generateChatId } from "@/lib/chatFunctions";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const PersonalInfo = ({
  id,
  profileImage,
  fullName,
  jobTitle,
  email,
  status,
  rating,
  mainTrack,
  skills,
  currentJob,
  bio,
  education,
  linkedIn,
  github,
  isOwner,
  setIsModalOpen,
}) => {
  const currentUser = useCurrentUser();
  const handleStartChat = async (otherUserId) => {
    if (!currentUser) return;

    try {
      const chatId = generateChatId(currentUser.uid, otherUserId);
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [currentUser.uid, otherUserId],
          createdAt: serverTimestamp(),
          lastMessage: "",
        });
      }
      window.location.href = `/chat/${chatId}`;
    } catch (e) {
      console.error("Error starting chat:", e);
      setError("Failed to start chat. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={profileImage}
            alt={fullName}
            className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-sm"
          />
          {isOwner && (
            <button
              onClick={() => setIsModalOpen("profileImage")}
              className="absolute -bottom-1 -right-1 bg-[#B71C1C] text-white rounded-full p-1 hover:bg-[#B71C1C]/90 transition-colors"
              title="Edit profile image"
            >
              <FiEdit size={12} />
            </button>
          )}
        </div>
        <div className="flex justify-between gap-4 w-full items-start">
          <div>
            <h1 className="text-xl font-bold text-[#B71C1C]">{fullName}</h1>
            <p className="text-black text-sm">{jobTitle}</p>
            <p className="text-black flex items-center gap-1 text-sm">
              <FaEnvelope /> {email}
            </p>
            {status && (
              <p className="text-xs text-gray-500 mt-1">Status: {status}</p>
            )}
            {rating && (
              <p className="text-xs text-gray-500 mt-1">Rating: {rating}</p>
            )}
          </div>
          {!isOwner ? (
            <button
              onClick={() => handleStartChat(id)}
              className="flex gap-2 items-center text-[#B71C1C]"
            >
              <HiChatBubbleOvalLeft /> Chat
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-center">
        <div>
          <p className="text-xs text-gray-500">Main Track</p>
          <p className="text-base font-semibold text-[#B71C1C]">{mainTrack}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Skills</p>
          <p className="text-base font-semibold text-[#B71C1C]">
            {skills.length ? skills.map((s) => s.value || s).join(", ") : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Current Job</p>
          <p className="text-base font-semibold text-[#B71C1C]">
            {typeof currentJob === "string" && currentJob ? currentJob : "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <ProfileItem
          title="About Me"
          value={bio}
          onEdit={isOwner ? () => setIsModalOpen("about") : undefined}
          editable={isOwner}
        />
        <ProfileItem
          title="Education"
          value={
            education.school
              ? `${education.school} - ${education.degree} (${education.year})`
              : "-"
          }
          onEdit={isOwner ? () => setIsModalOpen("education") : undefined}
          editable={isOwner}
        />
        <ProfileItem
          title="LinkedIn"
          value={
            linkedIn ? (
              <a href={linkedIn} target="_blank" rel="noreferrer">
                {linkedIn}
              </a>
            ) : (
              "-"
            )
          }
          onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
          editable={isOwner}
        />
        <ProfileItem
          title="GitHub"
          value={
            github ? (
              <a href={github} target="_blank" rel="noreferrer">
                {github}
              </a>
            ) : (
              "-"
            )
          }
          onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
          editable={isOwner}
        />
      </div>
    </div>
  );
};

function ProfileItem({ title, value, onEdit, editable }) {
  return (
    <div>
      <p className="text-[#B71C1C] font-medium">{title}</p>
      <p className="text-black flex justify-between items-center">
        {value}
        {editable && onEdit && (
          <button
            className="text-gray-400 hover:text-[#B71C1C]"
            onClick={onEdit}
          >
            <FiEdit />
          </button>
        )}
      </p>
    </div>
  );
}

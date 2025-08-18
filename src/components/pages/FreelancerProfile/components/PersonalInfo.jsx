"use client";
import { FaEnvelope } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useNetworkError } from "@/hooks/useNetworkError";
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
  currentJob,
  bio,
  education,
  linkedIn,
  github,
  isOwner,
  setIsModalOpen,
}) => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { error, isRetrying, handleError, clearError, retryOperation } =
    useNetworkError();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleStartChat = async (otherUserId) => {
    if (!currentUser) return;

    try {
      setIsStartingChat(true);
      clearError();

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

      router.push(`/chat/${chatId}`);
    } catch (e) {
      handleError(e, "startChat");
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleRetryChat = () => {
    if (currentUser && !isRetrying) {
      retryOperation(() => handleStartChat(id));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-secondary/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={profileImage}
              alt={fullName}
              className="w-28 h-28 rounded-2xl border-4 border-white shadow-2xl object-cover"
            />
            {isOwner && (
              <button
                onClick={() => setIsModalOpen("profileImage")}
                className="absolute -bottom-2 -right-2 bg-primary text-white rounded-xl p-2.5 hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Edit profile image"
              >
                <FiEdit size={14} />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  {fullName}
                </h1>
                <p className="text-lg text-primary font-semibold">{jobTitle}</p>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    <span className="text-sm">{email}</span>
                  </div>
                  {status && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{status}</span>
                    </div>
                  )}
                </div>
                {rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(rating)
                              ? "text-yellow-400"
                              : "text-slate-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">({rating})</span>
                  </div>
                )}
              </div>

              {!isOwner && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStartChat(id)}
                    disabled={isStartingChat}
                    className="flex gap-2 items-center px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiChatBubbleOvalLeft size={18} />
                    {isStartingChat ? "Starting..." : "Start Chat"}
                  </button>
                  {error && (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 text-center">
                        {error.message}
                      </p>
                      <button
                        onClick={handleRetryChat}
                        disabled={isRetrying}
                        className="text-sm text-primary hover:text-primary/80 underline disabled:opacity-50"
                      >
                        {isRetrying ? "Retrying..." : "Try Again"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Main Track</p>
            <p className="text-base font-semibold text-primary">
              {mainTrack || "Not specified"}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Current Job</p>
            <p className="text-base font-semibold text-primary">
              {(typeof currentJob === "string") && currentJob
                ? currentJob
                : "Available"}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Status</p>
            <p className="text-base font-semibold text-green-600">
              {status || "Active"}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProfileItem
            title="About Me"
            value={bio || "No bio available"}
            onEdit={isOwner ? () => setIsModalOpen("about") : undefined}
            editable={isOwner}
          />
          <ProfileItem
            title="Education"
            value={
              education.school
                ? `${education.school} - ${education.degree} (${education.year})`
                : "No education information"
            }
            onEdit={isOwner ? () => setIsModalOpen("education") : undefined}
            editable={isOwner}
          />
          <ProfileItem
            title="LinkedIn"
            value={
              linkedIn ? (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {linkedIn}
                </a>
              ) : (
                "No LinkedIn profile"
              )
            }
            onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
            editable={isOwner}
          />
          <ProfileItem
            title="GitHub"
            value={
              github ? (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {github}
                </a>
              ) : (
                "No GitHub profile"
              )
            }
            onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
            editable={isOwner}
          />
        </div>
      </div>
    </div>
  );
};

function ProfileItem({ title, value, onEdit, editable }) {
  return (
    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary mb-1.5">{title}</p>
          <p className="text-slate-700 text-sm leading-relaxed break-words">
            {value}
          </p>
        </div>
        {editable && onEdit && (
          <button
            className="flex-shrink-0 p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all duration-200"
            onClick={onEdit}
            title={`Edit ${title}`}
          >
            <FiEdit size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

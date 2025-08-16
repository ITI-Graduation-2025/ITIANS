import { createPost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import Image from "next/image";
import { useState } from "react";
import { HiOutlinePaperClip, HiOutlinePhoto, HiOutlineXMark } from "react-icons/hi2";

export default function PostCreation({ currentUser }) {
  const [postContent, setPostContent] = useState("");
  const [postAttachment, setPostAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddPost = async (e) => {
    e.preventDefault();
    setError(null);
    const userId = currentUser?.uid || currentUser?.id;
    if (!postContent.trim() && !postAttachment) return;
    if (!currentUser || !userId) {
      setError("You must be logged in to create a post.");
      return;
    }
    let attachmentData = null;
    try {
      setUploading(true);
      if (postAttachment) {
        const url = await upload(postAttachment);
        const file = postAttachment.target.files[0];
        attachmentData = {
          name: file.name,
          type: file.type,
          url,
        };
      }
      const newPostData = {
        authorProfileImage: currentUser.profileImage || currentUser.photo || "",
        author: currentUser.name || "Unknown",
        role: currentUser.role || "Unknown",
        content: postContent,
        likes: [],
        comments: [],
        attachment: attachmentData,
        authorId: userId,
        authorFcmToken: currentUser.fcmToken,
      };

      await createPost(newPostData);
      setPostContent("");
      setPostAttachment(null);
    } catch (err) {
      setError("Error creating post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Share Your Thoughts</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddPost}>
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {currentUser.profileImage || currentUser.photo ? (
                <Image
                  src={currentUser?.profileImage || currentUser?.photo || ""}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                  width={48}
                  height={48}
                  alt={currentUser.fullName || "user"}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-slate-100">
                  {(currentUser?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="flex-1 space-y-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind? Share your projects, questions, or insights with the ITI community..."
                className="w-full border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none bg-slate-50/50 text-slate-700 placeholder-slate-400 transition-all duration-200"
                rows={4}
                disabled={uploading}
              />

              {/* Attachment Preview */}
              {postAttachment && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {postAttachment.type.startsWith("image") ? (
                        <div className="h-12 w-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <HiOutlinePhoto className="w-6 h-6 text-slate-500" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <HiOutlinePaperClip className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-slate-700 truncate max-w-xs">
                          {postAttachment.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {postAttachment.type}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostAttachment(null)}
                      disabled={uploading}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer flex items-center space-x-2 p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                    <HiOutlinePaperClip className="w-5 h-5" />
                    <span className="text-sm font-medium">Attach</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setPostAttachment(e)}
                      disabled={uploading}
                    />
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={
                    uploading || (!postContent.trim() && !postAttachment)
                  }
                >
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Share Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

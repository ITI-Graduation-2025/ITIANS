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
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 text-center backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 px-8 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
        <div className="relative flex items-center space-x-4">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Share Your Thoughts</h2>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Content */}
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm flex items-center space-x-3 backdrop-blur-sm">
            <div className="h-8 w-8 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleAddPost}>
          <div className="flex items-start space-x-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {currentUser.profileImage || currentUser.photo ? (
                <Image
                  src={currentUser?.profileImage || currentUser?.photo || ""}
                  className="h-14 w-14 rounded-full object-cover ring-4 ring-primary/20 shadow-lg group-hover:ring-primary/30 transition-all duration-300"
                  width={56}
                  height={56}
                  alt={currentUser.name}
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl ring-4 ring-primary/20 shadow-lg group-hover:ring-primary/30 transition-all duration-300">
                  {(currentUser?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Post Input */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, experiences, or questions with the ITI community..."
                  className="w-full min-h-[120px] p-4 bg-muted/30 border border-border/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/70 text-foreground backdrop-blur-sm"
                  disabled={uploading}
                />
                {postContent.length > 0 && (
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    {postContent.length} characters
                  </div>
                )}
              </div>

              {/* Attachment Preview */}
              {postAttachment && (
                <div className="relative bg-muted/30 border border-border/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <HiOutlinePaperClip className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {postAttachment.target.files[0].name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(postAttachment.target.files[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostAttachment(null)}
                      className="h-8 w-8 bg-destructive/20 text-destructive rounded-full flex items-center justify-center hover:bg-destructive/30 transition-colors duration-200"
                    >
                      <HiOutlineXMark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-3">
                  {/* File Upload */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={setPostAttachment}
                      accept="image/*,.pdf,.doc,.docx"
                      disabled={uploading}
                    />
                    <div className="h-10 w-10 bg-muted/50 hover:bg-muted border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105">
                      <HiOutlinePaperClip className="h-5 w-5" />
                    </div>
                  </label>

                  {/* Image Upload */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={setPostAttachment}
                      accept="image/*"
                      disabled={uploading}
                    />
                    <div className="h-10 w-10 bg-muted/50 hover:bg-muted border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105">
                      <HiOutlinePhoto className="h-5 w-5" />
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading || (!postContent.trim() && !postAttachment)}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Share Post</span>
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

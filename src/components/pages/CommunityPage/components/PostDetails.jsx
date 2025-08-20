import { useState } from "react";
import { sendPushNotification } from "@/services/notificationService";
import { updatePost } from "@/services/postServices";
import { upload, getCleanCloudinaryUrl, convertRawToAutoUrl, convertImageToAutoUrl } from "@/utils/upload";
import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineChatBubbleLeft,
  HiOutlineHeart,
  HiOutlinePaperClip,
  HiOutlinePhoto,
  HiOutlineXMark
} from "react-icons/hi2";
import PostComments from "./PostComments";

export default function PostDetails({ post, currentUser }) {
  const [commentInputs, setCommentInputs] = useState({});
  const [editingImage, setEditingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [openComments, setOpenComments] = useState(true); // Default to open for details view
  const fileInputRef = useRef();

  const handleLikePost = async () => {
    try {
      const userId = currentUser?.uid || currentUser?.id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      // Initialize likes as array if it doesn't exist
      const currentLikes = Array.isArray(post.likes) ? post.likes : [];
      const isCurrentlyLiked = currentLikes.includes(userId);

      let updatedLikes;
      if (isCurrentlyLiked) {
        // Remove user from likes array
        updatedLikes = currentLikes.filter((id) => id !== userId);
      } else {
        // Add user to likes array
        updatedLikes = [...currentLikes, userId];
        
        // Send like notification only when liking (not when unliking)
        if (post.authorFcmToken && post.authorId !== userId) {
          // Send push notification
          await sendPushNotification({
            title: `${currentUser.name} liked your post`,
            body: post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content,
            data: {
              type: "like",
              postId: post.id,
            },
            fcmToken: post.authorFcmToken,
          });
          
          // Add notification to database
          const likeNotification = {
            recipientId: post.authorId,
            senderId: userId,
            type: "like",
            message: `${currentUser.name} liked your post`,
            relatedId: post.id,
            read: false,
            createdAt: serverTimestamp(),
          };
          await addDoc(collection(db, "notifications"), likeNotification);
        }
      }

      await updatePost(post.id, {
        likes: updatedLikes,
      });
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const handleRepost = async () => {
    const userId = currentUser?.uid || currentUser?.id;
    if (!currentUser || !userId) {
      console.error("You must be logged in to repost.");
      return;
    }
    try {
      const newPostData = {
        authorProfileImage: currentUser.profileImage,
        author: currentUser.name || "Unknown",
        role: currentUser.role || "Unknown",
        content: post.content,
        likes: [],
        comments: [],
        attachment: post.attachment || null,
        repostOf: {
          authorProfileImage: post.authorProfileImage || "",
          author: post.author || "Unknown",
          authorId: post.authorId || "",
          role: post.role || "Unknown",
          content: post.content,
          timestamp: post.createdAt,
          attachment: post.attachment || null,
        },
        authorId: userId,
      };

      // Navigate to community page to create the repost
      window.location.href = "/community";
    } catch (err) {
      console.error("Error reposting:", err);
    }
  };

  const handleAddComment = async (comment, mentions = []) => {
    if (!comment.trim()) return;
    try {
      const newComment = {
        authorProfileImage: currentUser.profileImage || "",
        authorId: currentUser.id || currentUser.uid,
        authorName: currentUser.name || "Unknown",
        content: comment,
        mentions,
        createdAt: new Date().toISOString(),
      };

      const updatedComments = Array.isArray(post.comments)
        ? [...post.comments, newComment]
        : [newComment];

      await updatePost(post.id, {
        comments: updatedComments,
      });

      // Clear the comment input
      setCommentInputs({});

      // Send push notification to post author if it's not the current user
      if (post.authorId !== (currentUser?.uid || currentUser?.id)) {
        try {
          await sendPushNotification({
            title: "New Comment",
            body: `${currentUser.name || "Someone"} commented on your post`,
            data: {
              type: "comment",
              postId: post.id,
            },
            fcmToken: post.authorFcmToken,
          });
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await upload(e);

      // Update the post with new image
      await updatePost(post.id, {
        attachment: {
          name: file.name,
          type: file.type,
          url: imageUrl,
        },
      });

      setEditingImage(false);
      setImagePreview(null);
      setUploadingImage(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
      setImagePreview(null);
      setUploadingImage(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleDownload = async (downloadUrl, filename) => {
    try {
      // For documents, try blob download
      if (post.attachment?.type && !post.attachment.type.startsWith("image/")) {
        const response = await fetch(downloadUrl, {
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          return;
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(blobUrl);
        
        return;
      } else {
        // For images, try direct download first, then fallback to blob
        try {
          // First attempt: direct download
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          return;
        } catch (directError) {
          return;
          
          // Fallback to blob method
          const response = await fetch(downloadUrl, {
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (!response.ok) {
            return;
          }
          
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the URL
          window.URL.revokeObjectURL(blobUrl);
          
          return;
        }
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const isLiked = Array.isArray(post.likes) && post.likes.includes(currentUser?.uid || currentUser?.id);
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;

  return (
    <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm">
      {/* Repost Header */}
      {post.repostOf && (
        <div className="bg-gradient-to-r from-muted/30 to-muted/50 border-b border-border/50 px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <HiOutlineArrowPathRoundedSquare className="w-4 h-4 text-primary" />
          <span className="font-medium">{post.author} reposted</span>
        </div>
      )}

      {/* Post Header */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Author Avatar */}
          <Link href={`/${post.role?.toLowerCase() === "mentor" ? "mentor" : post.role?.toLowerCase() === "company" ? "companies" : "profile"}/${post.authorId}`}>
            {post.authorProfileImage ? (
              <Image
                src={post.authorProfileImage || ""}
                alt={post.author}
                className="h-12 w-12 rounded-full cursor-pointer ring-2 ring-slate-100 hover:ring-primary/20 transition-all duration-200"
                width={48}
                height={48}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-slate-100 hover:ring-primary/20 transition-all duration-200">
                {post.author.charAt(0)}
              </div>
            )}
          </Link>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="min-w-0">
              <Link href={`/${post.role?.toLowerCase() === "mentor" ? "mentor" : post.role?.toLowerCase() === "company" ? "companies" : "profile"}/${post.authorId}`}>
                <h4 className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors truncate">
                  {post.author}
                </h4>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="capitalize">{post.role}</span>
                <span>•</span>
                <span>{formatTimestamp(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Edit Button for Post Owner */}
          {post.authorId === (currentUser?.uid || currentUser?.id) && (
            <Link
              href={`/community/${post.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </Link>
          )}
        </div>

              {/* Repost Content */}
        {post.repostOf && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Link href={`/${post.repostOf?.role?.toLowerCase() === "mentor" ? "mentor" : post.repostOf?.role?.toLowerCase() === "company" ? "companies" : "profile"}/${post.repostOf?.authorId}`}>
                {post.repostOf.authorProfileImage ? (
                  <Image
                    src={post.repostOf.authorProfileImage || ""}
                    alt={post.repostOf.author}
                    className="h-8 w-8 rounded-full cursor-pointer ring-2 ring-slate-200"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-slate-200">
                    {post.repostOf.author.charAt(0)}
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-sm">
                  <Link href={`/${post.repostOf?.role?.toLowerCase() === "mentor" ? "mentor" : post.repostOf?.role?.toLowerCase() === "company" ? "companies" : "profile"}/${post.repostOf?.authorId}`}>
                    <span className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">
                      {post.repostOf.author}
                    </span>
                  </Link>
                  <span className="text-muted-foreground capitalize">{post.repostOf.role}</span>
                  <span className="text-muted-foreground/70">•</span>
                  <span className="text-muted-foreground/70">{formatTimestamp(post.repostOf.timestamp)}</span>
                </div>
                <p className="mt-1 text-foreground text-sm">{post.repostOf.content}</p>
                
                {/* Repost Attachment */}
                {post.repostOf.attachment && (
                  <div className="mt-3">
                    {post.repostOf.attachment.type && post.repostOf.attachment.type.startsWith("image") ? (
                      <div className="relative w-full">
                        <img
                          src={post.repostOf.attachment.url}
                          alt="Repost attachment"
                          className="w-full h-auto max-h-48 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <a
                          href={post.repostOf.attachment.url}
                          download={post.repostOf.attachment.name}
                          className="inline-flex items-center text-primary hover:text-primary/80 text-sm bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
                        >
                          <HiOutlinePaperClip className="w-4 h-4 mr-2" />
                          {post.repostOf.attachment.name}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Post Content */}
        {!post.repostOf && (
          <>
            <p className="mt-4 text-foreground text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Post Attachment */}
        {post.attachment && (
          <div className="mt-4">
            {post.attachment.type && post.attachment.type.startsWith("image") ? (
              <div className="relative w-full">
                <img
                  src={post.attachment.url}
                  alt="Post attachment"
                  className="w-full h-auto max-h-96 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <button
                  onClick={() => handleDownload(post.attachment.url, post.attachment.name)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                  title="Download image"
                >
                  <HiOutlineArrowDownTray className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href={post.attachment.url}
                  download={post.attachment.name}
                  className="inline-flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-primary hover:text-primary/80 hover:bg-slate-100 transition-colors"
                >
                  <HiOutlinePaperClip className="w-5 h-5 mr-3" />
                  <span className="max-w-xs truncate font-medium">{post.attachment.name}</span>
                </a>
                <button
                  onClick={() => handleDownload(post.attachment.url, post.attachment.name)}
                  className="text-primary hover:text-primary/80 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                  title="Download file"
                >
                  <HiOutlineArrowDownTray className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>

      {/* Post Actions */}
      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLikePost}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isLiked
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted/30"
              }`}
            >
              <HiOutlineHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/30 transition-all duration-200"
              onClick={() => setOpenComments(!openComments)}
            >
              <HiOutlineChatBubbleLeft className="w-5 h-5" />
              <span className="font-medium">{commentsCount}</span>
            </button>

            {/* Repost Button */}
            <button
              onClick={handleRepost}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/30 transition-all duration-200"
            >
              <HiOutlineArrowPathRoundedSquare className="w-5 h-5" />
              <span className="font-medium">Repost</span>
            </button>
          </div>

          {/* Back to Community */}
          <Link
            href="/community"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 hover:text-foreground transition-all duration-200"
          >
            Back to Community
          </Link>
        </div>
      </div>

      {/* Comments Section */}
      {openComments && (
        <PostComments
          post={post}
          currentUser={currentUser}
          commentInputs={commentInputs}
          setCommentInputs={setCommentInputs}
          onAddComment={handleAddComment}
        />
      )}

      {/* Image Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative border border-border/50 max-h-[90vh] overflow-auto backdrop-blur-sm">
            <button
              onClick={() => setEditingImage(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground p-3 hover:bg-muted/50 rounded-full transition-all duration-200"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlinePhoto className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Edit Post Image</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                Upload a new image to replace the current one. Your post will be updated instantly.
              </p>
            </div>

            <div className="space-y-8">
              {/* Current Image Preview */}
              <div className="relative">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Current Image</h3>
                  <p className="text-sm text-muted-foreground">This is the image currently displayed in your post</p>
                </div>
                <div className="relative inline-block">
                  <img
                    src={imagePreview || post.attachment.url}
                    alt="Current"
                    className="w-full max-w-md h-80 object-cover rounded-2xl border-2 border-border/50 shadow-lg"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Upload New Image</h3>
                  <p className="text-sm text-muted-foreground">Choose a new image to replace the current one</p>
                </div>
                
                <div className="flex justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl font-semibold hover:from-primary/90 hover:to-primary/80 disabled:opacity-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <HiOutlinePhoto className="w-6 h-6" />
                    {uploadingImage ? "Uploading..." : "Choose New Image"}
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-slate-600 mb-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Supported Formats</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    JPG, PNG, GIF • Maximum file size: 5MB • Recommended: Square images for best display
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { db } from "@/config/firebase";
import { sendPushNotification } from "@/services/notificationService";
import { createPost, deletePost, updatePost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlinePaperClip,
  HiOutlinePencil,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineChatBubbleLeft,
  HiOutlineArrowPathRoundedSquare,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import PostComments from "./PostComments";

export default function PostItem({ post, currentUser, disableEditDelete = false }) {
  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  const [openComments, setOpenComments] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [editingPost, setEditingPost] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editingImage, setEditingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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

      await createPost(newPostData);
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
      if (post.authorFcmToken && post.authorId !== currentUser.id) {
        await sendPushNotification({
          token: post.authorFcmToken,
          title: `${currentUser.name} commented on your post`,
          body: comment,
          data: { url: `/community` },
        });
        var acceptedNotification = {
          recipientId: post.authorId,
          senderId: newComment.authorId,
          type: "comment",
          message: `${currentUser.name} commented on your post`,
          relatedId: post.id,
          read: false,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "notifications"), acceptedNotification);
      }
      mentions.forEach(async (user) => {
        if (user.fcmToken && user.id !== currentUser.id) {
          await sendPushNotification({
            token: user.fcmToken,
            title: `${currentUser.name} mentioned you in a comment`,
            body: comment,
            data: { url: `/community` },
          });
          var acceptedNotification = {
            recipientId: user.id,
            senderId: newComment.authorId,
            type: "comment_mention",
            message: `${newComment.authorName} mentioned you in a comment`,
            relatedId: post.id,
            read: false,
            createdAt: serverTimestamp(),
          };
          await addDoc(collection(db, "notifications"), acceptedNotification);
        }
      });
      setCommentInputs((inputs) => ({ ...inputs, [post.id]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleEditPost = async () => {
    if (!editContent.trim()) return;

    try {
      await updatePost(post.id, {
        content: editContent,
      });
      setEditingPost(false);
      setEditContent("");
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(post.id);
    } catch (err) {
      console.error("Error deleting post:", err);
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

  const startEditing = () => {
    setEditingPost(true);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPost(false);
    setEditContent("");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const downloadFile = async (url, filename) => {
    try {
      // Use our API endpoint to handle the download
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Download started for:", filename);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback: open in new tab
      window.open(url, "_blank");
      alert("File opened in new tab. You can save it from there.");
    }
  };

  const getFileExtension = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = pathname.split(".").pop();
      return extension || "jpg"; // Default to jpg for images
    } catch {
      return "jpg";
    }
  };

  const getFileName = (post, attachment) => {
    if (attachment?.name) {
      return attachment.name;
    }

    const extension = getFileExtension(attachment?.url || "");
    const timestamp = new Date().getTime();
    return `post_${post.id}_${timestamp}.${extension}`;
  };

  const isImageAttachment =
    post.attachment &&
    post.attachment.type &&
    post.attachment.type.startsWith("image");
  const isPostOwner = post.authorId === (currentUser?.uid || currentUser?.id);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Repost Header */}
      {post.repostOf && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-3 flex items-center gap-2 text-sm text-slate-600">
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

          {/* Author Info & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <Link href={`/${post.role?.toLowerCase() === "mentor" ? "mentor" : post.role?.toLowerCase() === "company" ? "companies" : "profile"}/${post.authorId}`}>
                  <h4 className="font-semibold text-slate-800 cursor-pointer hover:text-primary transition-colors truncate">
                    {post.author}
                  </h4>
                </Link>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <span className="capitalize">{post.role}</span>
                  <span>•</span>
                  <span>{formatTimestamp(post.createdAt)}</span>
                </div>
              </div>

              {/* Edit/Delete Menu */}
              {isPostOwner && !disableEditDelete && (
                <div className="relative group">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <HiOutlineEllipsisHorizontal className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[140px]">
                    <button
                      onClick={startEditing}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-3 rounded-t-xl transition-colors"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 rounded-b-xl transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                    <span className="font-semibold text-slate-700 cursor-pointer hover:text-primary transition-colors">
                  {post.repostOf.author}
                    </span>
              </Link>
                  <span className="text-slate-500 capitalize">{post.repostOf.role}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{formatTimestamp(post.repostOf.timestamp)}</span>
            </div>
                <p className="mt-1 text-slate-700 text-sm">{post.repostOf.content}</p>
                
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
                    <button
                           onClick={() => downloadFile(post.repostOf.attachment.url, getFileName(post, post.repostOf.attachment))}
                           className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                      title="Download image"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
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
                    <button
                          onClick={() => downloadFile(post.repostOf.attachment.url, post.repostOf.attachment.name)}
                          className="text-primary hover:text-primary/80 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Download file"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
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
            {editingPost ? (
              <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <HiOutlinePencilSquare className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Edit Post</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Post Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none bg-white text-slate-700 placeholder-slate-400 transition-all duration-200 shadow-sm"
                      rows={4}
                      placeholder="Edit your post content..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-slate-500">
                      {editContent.length} characters
                    </div>
                    <div className="flex space-x-3">
                  <button
                    onClick={cancelEditing}
                        className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all duration-200 border border-slate-200"
                  >
                    Cancel
                  </button>
                      <button
                        onClick={handleEditPost}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                        disabled={!editContent.trim()}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-slate-700 text-base leading-relaxed">{post.content}</p>
            )}

                             {/* Post Attachment */}
            {post.attachment && (
                   <div className="mt-4">
                {isImageAttachment ? (
                       <div className="relative w-full">
                    <img
                      src={post.attachment.url}
                         alt="Post attachment"
                         className="w-full h-auto max-h-96 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                    <button
                         onClick={() => downloadFile(post.attachment.url, getFileName(post, post.attachment))}
                         className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                      title="Download image"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                    {isPostOwner && (
                      <button
                        onClick={() => setEditingImage(true)}
                           className="absolute top-3 left-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                        title="Edit image"
                      >
                        <HiOutlinePhoto className="w-4 h-4" />
                      </button>
                    )}
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
                      onClick={() => downloadFile(post.attachment.url, post.attachment.name)}
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
        <button
          onClick={handleLikePost}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              Array.isArray(post.likes) && post.likes.includes(currentUser?.uid || currentUser?.id) 
                ? "text-primary bg-primary/10" 
                : "text-slate-600 hover:text-primary hover:bg-slate-50"
            }`}
          >
            <HiOutlineHeart className={`w-5 h-5 ${Array.isArray(post.likes) && post.likes.includes(currentUser?.uid || currentUser?.id) ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {Array.isArray(post.likes) ? post.likes.length : 0}
          </span>
        </button>
          
        <button
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 transition-all duration-200"
          onClick={() => setOpenComments(!openComments)}
        >
            <HiOutlineChatBubbleLeft className="w-5 h-5" />
            <span className="font-medium">
              {Array.isArray(post.comments) ? post.comments.length : 0}
          </span>
        </button>
          
        <button
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 transition-all duration-200"
          onClick={handleRepost}
        >
            <HiOutlineArrowPathRoundedSquare className="w-5 h-5" />
            <span className="font-medium">Repost</span>
        </button>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative border border-slate-200 max-h-[90vh] overflow-auto">
            <button
              onClick={() => setEditingImage(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-3 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlinePhoto className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Edit Post Image</h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                Upload a new image to replace the current one. Your post will be updated instantly.
              </p>
            </div>

            <div className="space-y-8">
              {/* Current Image Preview */}
                <div className="relative">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Current Image</h3>
                  <p className="text-sm text-slate-500">This is the image currently displayed in your post</p>
                </div>
                <div className="relative inline-block">
                  <img
                    src={imagePreview || post.attachment.url}
                    alt="Current"
                    className="w-full max-w-md h-80 object-cover rounded-2xl border-2 border-slate-200 shadow-lg"
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
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload New Image</h3>
                  <p className="text-sm text-slate-500">Choose a new image to replace the current one</p>
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

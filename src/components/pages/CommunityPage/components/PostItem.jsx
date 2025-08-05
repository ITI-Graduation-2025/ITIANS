import { db } from "@/config/firebase";
import { sendPushNotification } from "@/services/notificationService";
import { createPost, deletePost, updatePost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlinePaperClip,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import PostComments from "./PostComments";

export default function PostItem({ post, currentUser }) {
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
    if (!file.type.startsWith('image/')) {
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
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const downloadFile = async (url, filename) => {
    try {
      // Use our API endpoint to handle the download
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Download started for:", filename);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback: open in new tab
      window.open(url, '_blank');
      alert("File opened in new tab. You can save it from there.");
    }
  };

  const getFileExtension = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = pathname.split('.').pop();
      return extension || 'jpg'; // Default to jpg for images
    } catch {
      return 'jpg';
    }
  };

  const getFileName = (post, attachment) => {
    if (attachment?.name) {
      return attachment.name;
    }
    
    const extension = getFileExtension(attachment?.url || '');
    const timestamp = new Date().getTime();
    return `post_${post.id}_${timestamp}.${extension}`;
  };

  const isImageAttachment = post.attachment && post.attachment.type && post.attachment.type.startsWith("image");
  const isPostOwner = post.authorId === (currentUser?.uid || currentUser?.id);

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      {post.repostOf && (
        <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2 text-sm text-primary">
          <span className="font-semibold">{post.author} reposted</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Link href={`/profile/${post.authorId}`}>
            {post.authorProfileImage ? (
              <Image
                src={post.authorProfileImage || ""}
                alt={post.author}
                className="h-12 w-12 rounded-full cursor-pointer"
                width={100}
                height={100}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold cursor-pointer">
                {post.author.charAt(0)}
              </div>
            )}
          </Link>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/profile/${post.authorId}`}>
                  <h4 className="font-bold cursor-pointer hover:underline">
                    {post.author}
                  </h4>
                </Link>
                <p className="text-sm text-muted-foreground">{post.role}</p>
              </div>
              {/* Edit/Delete options for current user's posts */}
              {isPostOwner && (
                <div className="relative group">
                  <button className="text-muted-foreground hover:text-foreground">
                    <HiOutlineEllipsisHorizontal className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-6 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                    <button
                      onClick={startEditing}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center space-x-2"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {post.repostOf && (
          <div className="mt-3 bg-muted border border-border rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <Link href={`/profile/${post.repostOf?.authorId}`}>
                {post.repostOf.authorProfileImage ? (
                  <Image
                    src={post.repostOf.authorProfileImage || ""}
                    alt={post.repostOf.author}
                    className="h-12 w-12 rounded-full cursor-pointer"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer">
                    {post.repostOf.author.charAt(0)}
                  </div>
                )}
              </Link>
              <Link href={`/profile/${post.repostOf?.authorId}`}>
                <h5 className="font-semibold text-sm cursor-pointer hover:underline">
                  {post.repostOf.author}
                </h5>
              </Link>
              <p className="text-xs text-muted-foreground">
                {post.repostOf.role}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimestamp(post.repostOf.timestamp)}
              </p>
            </div>
            <p className="mt-2 text-foreground text-sm">
              {post.repostOf.content}
            </p>
            {post.repostOf.attachment && (
              <div className="mt-2">
                {post.repostOf.attachment.type &&
                post.repostOf.attachment.type.startsWith("image") ? (
                  <div className="relative inline-block">
                    <img
                      src={post.repostOf.attachment.url}
                      alt="Attachment"
                      className="max-h-48 w-auto rounded-lg border"
                    />
                    <button
                      onClick={() => downloadFile(post.repostOf.attachment.url, getFileName(post, post.repostOf.attachment))}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
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
                      className="inline-flex items-center text-primary hover:text-primary/80 text-sm"
                    >
                      <HiOutlinePaperClip className="w-4 h-4 mr-1" />
                      {post.repostOf.attachment.name}
                    </a>
                    <button
                      onClick={() => downloadFile(post.repostOf.attachment.url, post.repostOf.attachment.name)}
                      className="text-primary hover:text-primary/80 p-1 rounded"
                      title="Download file"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!post.repostOf && (
          <>
            {editingPost ? (
              <div className="mt-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
                  rows={3}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleEditPost}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-foreground">{post.content}</p>
            )}
            {post.attachment && (
              <div className="mt-3 relative">
                {isImageAttachment ? (
                  <div className="relative inline-block">
                    <img
                      src={post.attachment.url}
                      alt="Attachment"
                      className="max-h-96 w-full object-contain rounded-lg border"
                    />
                    <button
                      onClick={() => downloadFile(post.attachment.url, getFileName(post, post.attachment))}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      title="Download image"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                    {isPostOwner && (
                      <button
                        onClick={() => setEditingImage(true)}
                        className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        title="Edit image"
                      >
                        <HiOutlinePhoto className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <a
                      href={post.attachment.url}
                      download={post.attachment.name}
                      className="inline-flex items-center p-3 bg-muted rounded-lg border border-border text-primary hover:text-primary/80"
                    >
                      <HiOutlinePaperClip className="w-4 h-4 mr-2" />
                      <span className="max-w-xs truncate">
                        {post.attachment.name}
                      </span>
                    </a>
                    <button
                      onClick={() => downloadFile(post.attachment.url, post.attachment.name)}
                      className="text-primary hover:text-primary/80 p-2 rounded-lg border border-border"
                      title="Download file"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-border px-4 py-2 flex justify-between">
        <button
          onClick={handleLikePost}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${Array.isArray(post.likes) && post.likes.includes(currentUser?.uid || currentUser?.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
        >
          <HiOutlineHandThumbUp className="w-5 h-5" />
          <span>
            Like ({Array.isArray(post.likes) ? post.likes.length : 0})
          </span>
        </button>
        <button
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted"
          onClick={() => setOpenComments(!openComments)}
        >
          <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
          <span>
            Comment ({Array.isArray(post.comments) ? post.comments.length : 0})
          </span>
        </button>
        <button
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted"
          onClick={handleRepost}
        >
          <HiOutlineArrowPath className="w-5 h-5" />
          <span>Repost</span>
        </button>
      </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-border max-h-[90vh] overflow-auto">
            <button
              onClick={() => setEditingImage(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Edit Image
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {/* Current Image */}
                <div className="relative">
                  <img
                    src={imagePreview || post.attachment.url}
                    alt="Current"
                    className="w-64 h-64 object-cover rounded-lg border"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="flex gap-2">
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
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <HiOutlinePhoto />
                    {uploadingImage ? "Uploading..." : "Upload New Image"}
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createPost, deletePost, updatePost } from "@/services/firebase";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEllipsisHorizontal,
  HiOutlineHandThumbUp,
  HiOutlinePaperClip,
  HiOutlinePencil,
  HiOutlineTrash,
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

  const handleLikePost = async () => {
    try {
      const updatedLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
      const updatedIsLiked = !post.isLiked;

      await updatePost(post.id, {
        likes: updatedLikes,
        isLiked: updatedIsLiked,
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
        likes: 0,
        comments: [],
        isLiked: false,
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
      console.log(newPostData);
      // console.log(post);

      await createPost(newPostData);
    } catch (err) {
      console.error("Error reposting:", err);
    }
  };
  console.log(post);
  const handleAddComment = async (comment) => {
    if (!comment.trim()) return;
    try {
      const newComment = {
        authorProfileImage: currentUser.profileImage,
        authorId: currentUser.id || currentUser.uid,
        authorName: currentUser.name || "Unknown",
        content: comment,
        createdAt: new Date().toISOString(),
      };
      const updatedComments = Array.isArray(post.comments)
        ? [...post.comments, newComment]
        : [newComment];
      await updatePost(post.id, {
        comments: updatedComments,
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
              {post.authorId === (currentUser?.uid || currentUser?.id) && (
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
                  <img
                    src={post.repostOf.attachment.url}
                    alt="Attachment"
                    className="max-h-48 w-auto rounded-lg border"
                  />
                ) : (
                  <a
                    href={post.repostOf.attachment.url}
                    download={post.repostOf.attachment.name}
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm"
                  >
                    <HiOutlinePaperClip className="w-4 h-4 mr-1" />{" "}
                    {post.repostOf.attachment.name}
                  </a>
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
              <div className="mt-3">
                {post.attachment.type &&
                post.attachment.type.startsWith("image") ? (
                  <img
                    src={post.attachment.url}
                    alt="Attachment"
                    className="max-h-96 w-full object-contain rounded-lg border"
                  />
                ) : (
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
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-border px-4 py-2 flex justify-between">
        <button
          onClick={handleLikePost}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${post.isLiked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
        >
          <HiOutlineHandThumbUp className="w-5 h-5" />
          <span>Like ({post.likes || 0})</span>
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
    </div>
  );
}

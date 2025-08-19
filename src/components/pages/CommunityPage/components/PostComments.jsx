import { UsersContext } from "@/context/usersContext";
import { updatePost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePencilSquare,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineXCircle,
} from "react-icons/hi2";

export default function PostComments({
  post,
  currentUser,
  commentInputs,
  setCommentInputs,
  onAddComment,
}) {
  const [mentions, setMentions] = useState([]);
  const [comment, setComment] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState();
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    commentIndex: null,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { users } = useContext(UsersContext);
  const textareaRef = useRef();
  const commentImageRef = useRef();
  const editImageRef = useRef();
  const commentsContainerRef = useRef();

  // Auto-scroll to top when new comments are added (since newest are at top)
  useEffect(() => {
    if (commentsOpen && commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = 0;
    }
  }, [post.comments, commentsOpen]);

  const renderCommentText = (text) => {
    const mentionRegex = /@[\w\s]+?(?=\s|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + mention.length;

      // Extract the first word of the mention (after @)
      const mentionText = mention.slice(1).split(" ")[0];

      // Add text before the mention
      if (startIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="text-slate-700">
            {text.slice(lastIndex, startIndex)}
          </span>,
        );
      }

      // Add the mention (first word only) in primary color with light background
      parts.push(
        <span
          key={`mention-${startIndex}`}
          className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-md font-medium"
        >
          {mentionText}
        </span>,
      );

      lastIndex = endIndex;
    }

    // Add remaining text after the last mention
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-slate-700">
          {text.slice(lastIndex)}
        </span>,
      );
    }

    return parts;
  };

  const handleSuggestionSelect = (selectedUser) => {
    const textBeforeCursor = comment.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      // Use only the first word of the username as the alias
      const alias = selectedUser.name.split(" ")[0];
      const newComment =
        comment.slice(0, lastAtIndex) +
        `@${alias} ` +
        comment.slice(cursorPosition);
      setMentions((prev) => [
        ...prev,
        {
          name: selectedUser.name,
          id: selectedUser.id,
          fcmToken: selectedUser.fcmToken || "",
        },
      ]);

      setComment(newComment);
      setCommentInputs((inputs) => ({
        ...inputs,
        [post.id]: newComment,
      }));
      setSuggestions([]);
      textareaRef.current.focus();
      // Update cursor position to after the inserted alias
      setCursorPosition(lastAtIndex + alias.length + 2);
    }
  };

  const handleCommentImageUpload = async (e) => {
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
        setCommentImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await upload(e);
      setCommentImage(imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
      setCommentImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditImageUpload = async (e) => {
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
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await upload(e);
      setEditImage(imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
      setEditImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeCommentImage = () => {
    setCommentImage(null);
    if (commentImageRef.current) {
      commentImageRef.current.value = "";
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    if (editImageRef.current) {
      editImageRef.current.value = "";
    }
  };

  const handleEditComment = (commentIndex, commentData) => {
    setEditingComment(commentIndex);
    setEditContent(commentData.content || "");
    setEditImage(commentData.image || null);
  };

  const handleSaveEdit = async (commentIndex) => {
    if (!editContent.trim() && !editImage) return;

    try {
      const updatedComments = [...post.comments];
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        content: editContent,
        image: editImage,
        editedAt: new Date().toISOString(),
      };

      await updatePost(post.id, {
        comments: updatedComments,
      });

      setEditingComment(null);
      setEditContent("");
      setEditImage(null);
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    if (deleteModal.commentIndex === null) return;

    try {
      const updatedComments = post.comments.filter(
        (_, index) => index !== deleteModal.commentIndex,
      );
      await updatePost(post.id, {
        comments: updatedComments,
      });
      setDeleteModal({ show: false, commentIndex: null });
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const showDeleteModal = (commentIndex) => {
    setDeleteModal({ show: true, commentIndex });
  };

  const hideDeleteModal = () => {
    setDeleteModal({ show: false, commentIndex: null });
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
    setEditImage(null);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const commentText = commentInputs[post.id] || "";
    if (!commentText.trim() && !commentImage) return;

    try {
      const newComment = {
        authorProfileImage: currentUser.profileImage || "",
        authorId: currentUser.id || currentUser.uid,
        authorName: currentUser.name || "Unknown",
        content: commentText,
        image: commentImage,
        mentions,
        createdAt: new Date().toISOString(),
      };

      const updatedComments = Array.isArray(post.comments)
        ? [...post.comments, newComment]
        : [newComment];

      await updatePost(post.id, {
        comments: updatedComments,
      });
      onAddComment(newComment.content, mentions);
      // Reset form
      setCommentInputs((inputs) => ({ ...inputs, [post.id]: "" }));
      setCommentImage(null);
      setMentions([]);
      if (commentImageRef.current) {
        commentImageRef.current.value = "";
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setComment(value);
    setCommentInputs((inputs) => ({
      ...inputs,
      [post.id]: e.target.value,
    }));
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);

    // Find the word at the cursor position (allowing spaces in usernames)
    const textBeforeCursor = value.slice(0, cursor);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1).trimStart();
      if (query || query === "") {
        const filteredSuggestions = users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase()),
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const isCommentOwner = (comment) => {
    const currentUserId = currentUser?.uid || currentUser?.id;
    const commentAuthorId = comment.authorId;
    return currentUserId === commentAuthorId;
  };

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
  };

  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-6 border-t border-slate-200">
      {/* Comments Header with Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h5 className="font-semibold text-slate-700 text-lg">
          Comments ({commentCount})
        </h5>
        </div>
        {commentCount > 0 && (
          <button
            onClick={toggleComments}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/30 rounded-xl transition-all duration-200"
          >
            {commentsOpen ? (
              <>
                <HiOutlineChevronUp className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <HiOutlineChevronDown className="w-4 h-4" />
                Show
              </>
            )}
          </button>
        )}
      </div>

      {/* Comments List - Scrollable when open */}
      {commentsOpen && (
        <div
          ref={commentsContainerRef}
          className="max-h-96 overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        >
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            <ul className="space-y-4">
              {post.comments
                .slice()
                .reverse()
                .map((comment, idx) => {
                  if (typeof comment === "object" && comment !== null) {
                    const isOwner = isCommentOwner(comment);
                    const isEditing = editingComment === idx;

                    return (
                      <li key={idx} className="flex items-start space-x-3">
                        {/* Comment Avatar */}
                        <div className="flex-shrink-0">
                          {comment.authorProfileImage ? (
                            <Image
                              src={comment.authorProfileImage}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                              width={40}
                              height={40}
                              alt={comment.authorName || "Comment author"}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold ring-2 ring-slate-100">
                              {(comment.authorName || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-800 text-sm">
                              {comment.authorName || "Unknown"}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">
                                {comment.createdAt
                                  ? new Date(comment.createdAt).toLocaleString()
                                  : ""}
                              </span>
                              {comment.editedAt && (
                                <>
                                  <span className="text-xs text-slate-400">•</span>
                                  <span className="text-xs text-slate-500 italic">
                                  (edited)
                                </span>
                                </>
                              )}
                            </div>
                            
                            {/* Comment Actions */}
                            {isOwner && !isEditing && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditComment(idx, comment)}
                                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group"
                                  title="Edit comment"
                                >
                                  <HiOutlinePencilSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                                <button
                                  onClick={() => showDeleteModal(idx)}
                                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                  title="Delete comment"
                                >
                                  <HiOutlineTrash className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Edit Comment</label>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none bg-white text-slate-700 placeholder-slate-400 transition-all duration-200 shadow-sm"
                                  rows={3}
                                placeholder="Edit your comment..."
                              />
                                <div className="text-xs text-slate-400 text-right">
                                  {editContent.length} characters
                                </div>
                              </div>

                              {/* Edit Image Section */}
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Comment Image</label>
                                {editImage && (
                                   <div className="relative w-full">
                                    <img
                                      src={editImage}
                                      alt="Comment image"
                                       className="w-full h-auto max-h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                                    />
                                    <button
                                      onClick={removeEditImage}
                                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                      title="Remove image"
                                    >
                                      <HiOutlineXMark className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                <div className="flex items-center gap-3">
                                  <input
                                    ref={editImageRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageUpload}
                                    className="hidden"
                                    disabled={uploadingImage}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => editImageRef.current?.click()}
                                    disabled={uploadingImage}
                                    className="flex items-center gap-2 px-4 py-2 text-xs text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all duration-200 border border-primary/20"
                                  >
                                    <HiOutlinePhoto className="w-3 h-3" />
                                    {editImage ? "Change Image" : "Add Image"}
                                  </button>
                                  {uploadingImage && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                                      <span>Uploading...</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-3 pt-2">
                                <button
                                  onClick={() => handleSaveEdit(idx)}
                                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2 group"
                                  disabled={!editContent.trim() && !editImage}
                                >
                                  <HiOutlineCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                  Save Changes
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-muted/50 text-muted-foreground rounded-xl text-xs font-medium hover:bg-muted transition-all duration-200 flex items-center gap-2 group"
                                >
                                  <HiOutlineXCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {comment.content && (
                                <div className="text-slate-700 text-sm leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                  {renderCommentText(comment.content)}
                                </div>
                              )}
                              {comment.image && (
                                 <div className="mt-2 w-full">
                                  <img
                                    src={comment.image}
                                    alt="Comment attachment"
                                     className="w-full h-auto max-h-48 object-cover rounded-lg border border-slate-200 shadow-sm"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  } else {
                    // Fallback for old string comments
                    return (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-semibold ring-2 ring-slate-100">
                            U
                          </div>
                        <div className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-border/50 backdrop-blur-sm">
                                                      <div className="font-semibold text-foreground text-sm mb-2">Unknown User</div>
                            <div className="text-foreground text-sm">{comment}</div>
                        </div>
                      </li>
                    );
                  }
                })}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineChatBubbleLeftRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}

      {/* Comment Input Form */}
      <form className="space-y-4" onSubmit={handleSubmitComment}>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
            {currentUser.profileImage ? (
              <Image
                src={currentUser.profileImage}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                width={40}
                height={40}
                alt={currentUser.name || "Current user"}
              />
            ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold ring-2 ring-slate-100">
                  {(currentUser.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

            {/* Comment Input */}
            <div className="flex-1 space-y-3">
              <div className="relative">
                <textarea
            ref={textareaRef}
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none bg-slate-50/50 text-slate-700 placeholder-slate-400 transition-all duration-200 min-h-[60px]"
                  placeholder="Write a comment... Use @ to mention someone"
            value={commentInputs[post.id] || ""}
            onChange={handleInputChange}
                  rows={2}
          />
                
                {/* Submit Button */}
          <button
            type="submit"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group"
            disabled={
              !(commentInputs[post.id] && commentInputs[post.id].trim()) &&
              !commentImage
            }
          >
            <HiOutlineCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Comment Image Section */}
              <div className="space-y-3">
          {commentImage && (
                   <div className="relative w-full">
              <img
                src={commentImage}
                alt="Comment image"
                       className="w-full h-auto max-h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
              />
              <button
                type="button"
                onClick={removeCommentImage}
                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Remove image"
              >
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            </div>
          )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
            <input
              ref={commentImageRef}
              type="file"
              accept="image/*"
              onChange={handleCommentImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <button
              type="button"
              onClick={() => commentImageRef.current?.click()}
              disabled={uploadingImage}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all duration-200 border border-primary/20 font-medium"
            >
              <HiOutlinePhoto className="w-3 h-3" />
              {commentImage ? "Change Image" : "Add Image"}
            </button>
            {uploadingImage && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                        <span>Uploading...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    {commentInputs[post.id] ? commentInputs[post.id].length : 0} characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mentions Suggestions */}
        {suggestions.length > 0 && (
          <div className="relative">
            <ul className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border/50 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-20 backdrop-blur-sm">
            {suggestions.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSuggestionSelect(user)}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200 border-b border-slate-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center space-x-3">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                        width={40}
                        height={40}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold ring-2 ring-slate-100">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">@{user.name}</div>
                      <div className="text-xs text-slate-500 capitalize">{user.role || "User"}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
              </li>
            ))}
          </ul>
          </div>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-border/50 backdrop-blur-sm">
            <button
              onClick={hideDeleteModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                <HiOutlineXCircle className="h-10 w-10 text-red-600" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3">
                Delete Comment
              </h3>

              <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                Are you sure you want to delete this comment? This action cannot be undone and will remove the comment permanently.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={hideDeleteModal}
                  className="flex-1 px-6 py-3 border border-border/50 rounded-xl text-muted-foreground hover:bg-muted/30 transition-all duration-200 font-medium flex items-center justify-center gap-2 group"
                >
                  <HiOutlineXCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                >
                  <HiOutlineTrash className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Delete Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

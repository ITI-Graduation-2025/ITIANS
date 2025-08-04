import { UsersContext } from "@/context/usersContext";
import { updatePost } from "@/services/postServices";
import Image from "next/image";
import { useContext, useState, useRef } from "react";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from "react-icons/hi2";

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
  const [deleteModal, setDeleteModal] = useState({ show: false, commentIndex: null });
  const { users } = useContext(UsersContext);
  const textareaRef = useRef();

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
          <span key={`text-${lastIndex}`} className="text-black">
            {text.slice(lastIndex, startIndex)}
          </span>,
        );
      }

      // Add the mention (first word only) in Facebook blue with light gray background
      parts.push(
        <span
          key={`mention-${startIndex}`}
          className="text-[#1877F2] bg-[#E8ECEF] px-1 rounded-sm font-medium"
        >
          {mentionText}
        </span>,
      );

      lastIndex = endIndex;
    }

    // Add remaining text after the last mention
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-black">
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
          fcmToken: selectedUser.fcmToken||"",
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

  const handleEditComment = (commentIndex, commentData) => {
    setEditingComment(commentIndex);
    setEditContent(commentData.content || "");
  };

  const handleSaveEdit = async (commentIndex) => {
    if (!editContent.trim()) return;

    try {
      const updatedComments = [...post.comments];
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        content: editContent,
        editedAt: new Date().toISOString(),
      };

      await updatePost(post.id, {
        comments: updatedComments,
      });

      setEditingComment(null);
      setEditContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async () => {
    if (deleteModal.commentIndex === null) return;

    try {
      const updatedComments = post.comments.filter((_, index) => index !== deleteModal.commentIndex);
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
    console.log(textBeforeCursor);
    console.log(lastAtIndex);
    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1).trimStart();
      if (query || query === "") {
        console.log(query);

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

  return (
    <div className="bg-muted px-4 py-3 border-t border-border">
      <h5 className="font-semibold mb-3 text-primary">Comments</h5>
      {Array.isArray(post.comments) && post.comments.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {post.comments.map((comment, idx) => {
            if (typeof comment === "object" && comment !== null) {
              const isOwner = isCommentOwner(comment);
              const isEditing = editingComment === idx;

              return (
                <li key={idx} className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                    {comment.authorProfileImage ? (
                      <Image
                        src={comment.authorProfileImage}
                        className="h-8 w-8 rounded-full object-cover"
                        width={32}
                        height={32}
                        alt={comment.authorName || "Comment author"}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {(comment.authorName || "U").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-card rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">
                        {comment.authorName || "Unknown"}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : ""}
                        </span>
                        {comment.editedAt && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (edited)
                          </span>
                        )}
                      </div>
                      {isOwner && !isEditing && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditComment(idx, comment)}
                            className="text-muted-foreground hover:text-foreground p-1 rounded"
                            title="Edit comment"
                          >
                            <HiOutlinePencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => showDeleteModal(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                            title="Delete comment"
                          >
                            <HiOutlineTrash className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="mt-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full border border-input rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
                          rows={2}
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(idx)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/80"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-foreground text-sm mt-1">
                        {renderCommentText(comment.content || "")}
                      </div>
                    )}
                  </div>
                </li>
              );
            } else {
              // Fallback for old string comments
              return (
                <li key={idx} className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      U
                    </div>
                  </div>
                  <div className="flex-1 bg-card rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm">Unknown</div>
                    <div className="text-foreground text-sm mt-1">
                      {comment}
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      ) : (
        <div className="text-center text-muted-foreground text-sm py-4">
          No comments yet. Be the first to comment!
        </div>
      )}
      <form
        className="flex relative items-center mt-3 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onAddComment(commentInputs[post.id] || "", mentions);
        }}
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold flex-shrink-0">
          {currentUser.profileImage ? (
            <Image
              src={currentUser.profileImage}
              className="h-10 w-10 rounded-full object-cover"
              width={40}
              height={40}
              alt={currentUser.name || "Current user"}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {(currentUser.name || "U").charAt(0)}
            </div>
          )}
        </div>
        <input
          ref={textareaRef}
          type="text"
          className="flex-1 border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          placeholder="Write a comment..."
          value={commentInputs[post.id] || ""}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 disabled:opacity-50"
          disabled={!(commentInputs[post.id] && commentInputs[post.id].trim())}
        >
          ➤
        </button>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
            {suggestions.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSuggestionSelect(user)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                @{user.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-border">
            <button
              onClick={hideDeleteModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <HiOutlineTrash className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Delete Comment
              </h3>
              
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={hideDeleteModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

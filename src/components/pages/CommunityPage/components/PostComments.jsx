import { UsersContext } from "@/context/usersContext";
import Image from "next/image";
import { useContext, useState } from "react";

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
  const { users } = useContext(UsersContext);

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
   console.log(mentions);
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

  return (
    <div className="bg-muted px-4 py-3 border-t border-border">
      <h5 className="font-semibold mb-3 text-primary">Comments</h5>
      {Array.isArray(post.comments) && post.comments.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {post.comments.map((comment, idx) => {
            if (typeof comment === "object" && comment !== null) {
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
                    <div className="font-medium text-sm">
                      {comment.authorName || "Unknown"}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <div className="text-foreground text-sm mt-1">
                      {renderCommentText(comment.content || "")}
                    </div>
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
    </div>
  );
}

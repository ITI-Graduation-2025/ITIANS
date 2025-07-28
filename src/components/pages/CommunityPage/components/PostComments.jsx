export default function PostComments({ post, currentUser, commentInputs, setCommentInputs, onAddComment }) {
  return (
    <div className="bg-muted px-4 py-3 border-t border-border">
      <h5 className="font-semibold mb-3 text-primary">
        Comments
      </h5>
      {Array.isArray(post.comments) &&
      post.comments.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {post.comments.map((comment, idx) => {
            // If comment is an object, show details; if string, fallback
            if (typeof comment === 'object' && comment !== null) {
              return (
                <li key={idx} className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                    {comment.authorAvatar ? comment.authorAvatar.charAt(0) : '?'}
                  </div>
                  <div className="flex-1 bg-card rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm">
                      {comment.authorName || 'Unknown'}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="text-foreground text-sm mt-1">
                      {comment.content}
                    </div>
                  </div>
                </li>
              );
            } else {
              // Fallback for old string comments
              return (
                <li key={idx} className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                    ?
                  </div>
                  <div className="flex-1 bg-card rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-sm">Unknown</div>
                    <div className="text-foreground text-sm mt-1">{comment}</div>
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
        className="flex items-center mt-3 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onAddComment(commentInputs[post.id] || "");
        }}
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold flex-shrink-0">
          {currentUser?.avatar?.charAt(0) || '?'}
        </div>
        <input
          type="text"
          className="flex-1 border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          placeholder="Write a comment..."
          value={commentInputs[post.id] || ""}
          onChange={(e) =>
            setCommentInputs((inputs) => ({
              ...inputs,
              [post.id]: e.target.value,
            }))
          }
        />
        <button
          type="submit"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 disabled:opacity-50"
          disabled={
            !(
              commentInputs[post.id] &&
              commentInputs[post.id].trim()
            )
          }
        >
          
        </button>
      </form>
    </div>
  );
} 
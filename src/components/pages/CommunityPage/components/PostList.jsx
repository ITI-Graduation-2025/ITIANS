import PostItem from "./PostItem";

export default function PostList({ posts, currentUser, search }) {
  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-md p-8 text-center">
        <p className="text-muted-foreground">
          {search.trim()
            ? "No posts found matching your search."
            : "No posts yet. Be the first to share something!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          currentUser={currentUser} 
        />
      ))}
    </div>
  );
} 
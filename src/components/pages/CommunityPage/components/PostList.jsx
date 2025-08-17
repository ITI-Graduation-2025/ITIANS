import PostItem from "./PostItem";

export default function PostList({ posts, currentUser, search }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {search.trim() ? "No posts found" : "No posts yet"}
          </h3>
          <p className="text-slate-500 mb-6">
            {search.trim()
              ? "Try adjusting your search terms or browse all posts."
              : "Be the first to share something with the ITI community!"}
          </p>
          {!search.trim() && (
            <div className="inline-flex items-center space-x-2 text-primary font-medium">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create your first post above</span>
            </div>
          )}
        </div>
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
import { useState, useEffect } from "react";
import { getAllPosts, subscribeToPosts } from "@/services/postServices";
import PostItem from "@/components/pages/CommunityPage/components/PostItem";
import { EditPostModal } from "./EditPostModal";
import { DeletePostModal } from "./DeletePostModal";
import { CreatePostModal } from "./CreatePostModal";

export const Posts = ({ userPosts = [], currentUser, isOwner, userName }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);

  // Load posts from Firebase and filter for current user
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllPosts();
        // Filter posts to show only current user's posts
        const userPosts = allPosts.filter(post => post.authorId === (currentUser?.uid || currentUser?.id));
        setPosts(userPosts);
    } catch (err) {
        setError("Failed to load posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadPosts();

      // Subscribe to real-time updates
      const unsubscribe = subscribeToPosts((updatedPosts) => {
        // Filter updated posts for current user only
        const userPosts = updatedPosts.filter(post => post.authorId === (currentUser?.uid || currentUser?.id));
        setPosts(userPosts);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handlePostUpdated = () => {
    // Refresh posts after update
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        const userPosts = allPosts.filter(post => post.authorId === (currentUser?.uid || currentUser?.id));
        setPosts(userPosts);
    } catch (err) {
        console.error("Error refreshing posts:", err);
      }
    };
    loadPosts();
  };

  const handlePostDeleted = () => {
    // Refresh posts after deletion
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        const userPosts = allPosts.filter(post => post.authorId === (currentUser?.uid || currentUser?.id));
        setPosts(userPosts);
    } catch (err) {
        console.error("Error refreshing posts:", err);
      }
    };
    loadPosts();
  };

  const handlePostCreated = () => {
    // Refresh posts after creation
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        const userPosts = allPosts.filter(post => post.authorId === (currentUser?.uid || currentUser?.id));
        setPosts(userPosts);
    } catch (err) {
        console.error("Error refreshing posts:", err);
      }
    };
    loadPosts();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loading Posts</h2>
        <p className="text-slate-500">Gathering your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-3xl shadow-2xl border border-slate-200/50 p-8 relative overflow-hidden">
      {/* Enhanced Background Patterns */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-full translate-y-16 -translate-x-16 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-x-12 -translate-y-12 blur-lg"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-primary/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
                Your Posts
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-slate-600 text-base">
                  {posts.length} post{posts.length !== 1 ? 's' : ''} • Your community activity
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Live Updates</span>
                </div>
              </div>
          </div>
        </div>

          {/* Create Post Button */}
          {isOwner && (
            <button
              onClick={() => setCreatingPost(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl font-semibold hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
              Create Post
            </button>
          )}
                  </div>
                  
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="relative group">
                <PostItem 
                  post={post} 
                  currentUser={currentUser}
                  disableEditDelete={true} // Disable built-in edit/delete functionality
                />
                
                {/* Custom Action Buttons for Profile View */}
                  {isOwner && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                      onClick={() => setEditingPost(post)}
                      className="w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-700 hover:text-primary rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-slate-200/50"
                        title="Edit post"
                      >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                      onClick={() => setDeletingPost(post)}
                      className="w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm text-red-600 hover:text-red-700 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-slate-200/50"
                        title="Delete post"
                      >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">No Posts Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {isOwner 
                ? "Share your thoughts, achievements, or updates with the community to start building your presence"
                : "This freelancer hasn't shared any posts yet"
              }
            </p>
            {isOwner && (
              <button
                onClick={() => setCreatingPost(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={creatingPost}
        onClose={() => setCreatingPost(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onPostUpdated={handlePostUpdated}
      />

      {/* Delete Post Modal */}
      <DeletePostModal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        post={deletingPost}
        onPostDeleted={handlePostDeleted}
      />
    </div>
  );
};

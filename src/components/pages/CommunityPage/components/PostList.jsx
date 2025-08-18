import PostItem from "./PostItem";
import { HiOutlineChatBubbleLeftRight, HiOutlinePlusCircle, HiOutlineLightBulb, HiOutlineSignal } from "react-icons/hi2";

export default function PostList({ posts, currentUser, search }) {
  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-12 text-center backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="h-24 w-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HiOutlineChatBubbleLeftRight className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {search.trim() ? "No posts found" : "No posts yet"}
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            {search.trim()
              ? "Try adjusting your search terms or browse all posts."
              : "Be the first to share something with the ITI community!"}
          </p>
          {!search.trim() && (
            <div className="inline-flex items-center space-x-3 text-primary font-semibold bg-primary/10 px-6 py-3 rounded-2xl hover:bg-primary/20 transition-all duration-200 group">
              <HiOutlinePlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Create your first post above</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts Header */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Community Posts</h2>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
              {search.trim() && ` for "${search}"`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <HiOutlineSignal className="h-4 w-4 text-primary" />
              Live updates
            </span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div 
            key={post.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PostItem 
              post={post} 
              currentUser={currentUser} 
            />
          </div>
        ))}
      </div>
    </div>
  );
} 
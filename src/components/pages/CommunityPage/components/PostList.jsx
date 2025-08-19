import PostItem from "./PostItem";
import { HiOutlineChatBubbleLeftRight, HiOutlinePlusCircle, HiOutlineLightBulb, HiOutlineSignal, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function PostList({ posts, currentUser, search, onSearch }) {
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
      <div className="bg-gradient-to-r from-card via-card/95 to-card/90 rounded-2xl shadow-lg border border-border/50 p-5 backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10 blur-lg"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/10 rounded-full translate-y-8 -translate-x-8 blur-lg"></div>
        
        <div className="relative z-10">
          {/* Top row - Title and live indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            {/* Left side - Title and stats */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                  <HiOutlineChatBubbleLeftRight className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Community Posts
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                    {search.trim() && (
                      <span className="text-primary font-medium">
                        {" "}for "{search}"
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side - Live indicator only */}
            <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <div className="relative">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute inset-0 h-2 w-2 bg-primary/30 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-primary flex items-center gap-1">
                <HiOutlineSignal className="h-3 w-3" />
                Live updates
              </span>
            </div>
          </div>
          
          {/* Bottom row - Search input */}
          <div className="flex justify-center sm:justify-start">
            <div className="relative group w-full sm:w-80">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search posts by content or author..."
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300 w-full hover:bg-muted/50 hover:border-border/70 group-hover:shadow-md group-hover:shadow-primary/10"
                />
                {search.trim() && (
                  <button
                    onClick={() => onSearch('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
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
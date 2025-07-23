"use client";
import { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import {
  HiOutlineBell,
  HiOutlinePaperClip,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHandThumbUp,
  HiOutlineArrowPath,
  HiOutlineEllipsisHorizontal,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi2";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  subscribeToPosts,
} from "@/services/firebase";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [freelancers] = useState([
    { name: "Ahmed Mohamed", role: "Web Developer" },
    { name: "Amira Mostafa", role: "UI/UX Designer" },
    { name: "jihan Mohammed ", role: "Mobile Developer" },
    { name: "Islam Mohamed", role: "Backend Developer" },
    { name: "Wafaa Samir", role: "Full Stack Developer" },
  ]);

  const [search, setSearch] = useState("");
  const [postContent, setPostContent] = useState("");
  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [postAttachment, setPostAttachment] = useState(null);

  // Edit state
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");

  const currentUser = {
    name: "Wafaa Samir",
    role: "Web Developer - ITI Grad",
    avatar: "WS",
    uid: "current-user-id", // This should come from your auth system
  };

  // Load posts from Firebase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (err) {
        setError("Failed to load posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    return posts.filter(
      (post) =>
        (post.content &&
          post.content.toLowerCase().includes(search.toLowerCase())) ||
        (post.author &&
          post.author.toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, posts]);

  const filteredFreelancers = useMemo(() => {
    if (!search.trim()) return freelancers;
    return freelancers.filter(
      (freelancer) =>
        freelancer.name.toLowerCase().includes(search.toLowerCase()) ||
        freelancer.role.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, freelancers]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postAttachment) return;

    try {
      const newPostData = {
        author: currentUser.name,
        role: currentUser.role,
        content: postContent,
        likes: 0,
        comments: [],
        isLiked: false,
        attachment: postAttachment
          ? {
              name: postAttachment.name,
              type: postAttachment.type,
              url: URL.createObjectURL(postAttachment),
            }
          : null,
        authorId: currentUser.uid,
      };

      await createPost(newPostData);
      setPostContent("");
      setPostAttachment(null);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const updatedLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
      const updatedIsLiked = !post.isLiked;

      await updatePost(postId, {
        likes: updatedLikes,
        isLiked: updatedIsLiked,
      });
    } catch (err) {
      console.error("Error updating like:", err);
      setError("Failed to update like");
    }
  };

  const handleRepost = async (post) => {
    try {
      const newPostData = {
        author: currentUser.name,
        role: currentUser.role,
        content: post.content,
        likes: 0,
        comments: [],
        isLiked: false,
        attachment: post.attachment || null,
        repostOf: {
          author: post.author,
          role: post.role,
          content: post.content,
          timestamp: post.createdAt,
          attachment: post.attachment || null,
        },
        authorId: currentUser.uid,
      };

      await createPost(newPostData);
    } catch (err) {
      console.error("Error reposting:", err);
      setError("Failed to repost");
    }
  };

  const handleAddComment = async (postId, comment) => {
    if (!comment.trim()) return;

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const updatedComments = Array.isArray(post.comments)
        ? [...post.comments, comment]
        : [comment];

      await updatePost(postId, {
        comments: updatedComments,
      });

      setCommentInputs((inputs) => ({ ...inputs, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    }
  };

  const handleEditPost = async (postId) => {
    if (!editContent.trim()) return;

    try {
      await updatePost(postId, {
        content: editContent,
      });
      setEditingPost(null);
      setEditContent("");
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  const startEditing = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPost(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>ITI Freelancers Community</title>
        <meta
          name="description"
          content="Community for ITI graduates freelancers"
        />
      </Head>

      {error && (
        <div className="bg-destructive text-destructive-foreground p-4 text-center">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img
              src="/logo.jpeg"
              alt="ITI Logo"
              className="h-10 w-10 object-contain rounded-full border border-border bg-card mr-2"
            />
            <h1 className="text-2xl font-bold">ITI Freelancers Community</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts or freelancers..."
                className="px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background/80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-muted-foreground">
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
              </span>
            </div>
            <button className="p-2 rounded-full hover:bg-primary/80 transition-colors">
              <HiOutlineBell className="w-6 h-6" />
            </button>
            <div className="h-10 w-10 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground font-medium">
              {currentUser.avatar}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 space-y-6">
          <div className="bg-card rounded-xl shadow-md overflow-hidden border-l-4 border-primary">
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {currentUser.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <div className="text-center">
                  <div className="font-bold">
                    {posts.filter((p) => p.authorId === currentUser.uid).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">128</div>
                  <div className="text-xs text-muted-foreground">
                    Connections
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold">5</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h3 className="font-bold text-lg">ITI Companies</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {[
                  "Valeo",
                  "ITWorx",
                  "Orange Labs",
                  "Sumerge",
                  "IBM Egypt",
                  "Microsoft Egypt",
                ].map((company) => (
                  <li
                    key={company}
                    className="flex items-center space-x-3 hover:text-primary cursor-pointer transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary">
                      {company.charAt(0)}
                    </div>
                    <span>{company}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h3 className="font-bold text-lg">Upcoming Events</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-4">
                <li className="hover:bg-muted p-2 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="min-w-12 h-12 bg-secondary rounded-lg flex items-center justify-center font-bold text-secondary-foreground">
                      Jul
                    </div>
                    <div>
                      <div className="font-medium">ITI Alumni Meetup</div>
                      <div className="text-sm text-muted-foreground">
                        July 15, 2023 • Cairo
                      </div>
                    </div>
                  </div>
                </li>
                <li className="hover:bg-muted p-2 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="min-w-12 h-12 bg-secondary rounded-lg flex items-center justify-center font-bold text-secondary-foreground">
                      Jul
                    </div>
                    <div>
                      <div className="font-medium">Freelancing Workshop</div>
                      <div className="text-sm text-muted-foreground">
                        July 20, 2023 • Online
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="w-full md:w-2/4 space-y-6">
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h2 className="text-lg font-bold">Create a Post</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleAddPost}>
                <div className="flex items-start space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share your thoughts, projects, or questions..."
                      className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
                      rows={3}
                    />
                    {postAttachment && (
                      <div className="mt-2 p-3 bg-muted rounded-lg border border-border flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {postAttachment.type.startsWith("image") ? (
                            <img
                              src={URL.createObjectURL(postAttachment)}
                              alt="Preview"
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                              <HiOutlinePaperClip className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium truncate max-w-xs">
                              {postAttachment.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {postAttachment.type}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => setPostAttachment(null)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <label className="flex items-center space-x-1 text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                          <HiOutlinePaperClip className="w-5 h-5" />
                          <span className="text-sm">Attachment</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setPostAttachment(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
                        disabled={!postContent.trim() && !postAttachment}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-card rounded-xl shadow-md p-8 text-center">
              <p className="text-muted-foreground">
                {search.trim()
                  ? "No posts found matching your search."
                  : "No posts yet. Be the first to share something!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-xl shadow-md overflow-hidden"
              >
                {post.repostOf && (
                  <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2 text-sm text-primary">
                    <span className="font-semibold">
                      {post.author} reposted
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{post.author}</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.role}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(post.createdAt)}
                          </span>

                          {/* Edit/Delete dropdown for post owner */}
                          {post.authorId === currentUser.uid && (
                            <div className="relative group">
                              <button className="text-muted-foreground hover:text-foreground">
                                <HiOutlineEllipsisHorizontal className="w-5 h-5" />
                              </button>
                              <div className="absolute right-0 top-6 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                                <button
                                  onClick={() => startEditing(post)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                                >
                                  <HiOutlinePencil className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
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

                      {post.repostOf && (
                        <div className="mt-3 bg-muted border border-border rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {post.repostOf.author.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">
                                {post.repostOf.author}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {post.repostOf.role}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimestamp(post.repostOf.timestamp)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-foreground text-sm">
                            {post.repostOf.content}
                          </p>
                          {post.repostOf.attachment && (
                            <div className="mt-2">
                              {post.repostOf.attachment.type &&
                              post.repostOf.attachment.type.startsWith(
                                "image",
                              ) ? (
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
                          {editingPost === post.id ? (
                            <div className="mt-3">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
                                rows={3}
                              />
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => handleEditPost(post.id)}
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
                            <p className="mt-3 text-foreground">
                              {post.content}
                            </p>
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
                  </div>
                </div>

                <div className="border-t border-border px-4 py-2 flex justify-between">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${post.isLiked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <HiOutlineHandThumbUp className="w-5 h-5" />
                    <span>Like ({post.likes || 0})</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={() =>
                      setOpenComments(openComments === post.id ? null : post.id)
                    }
                  >
                    <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                    <span>
                      Comment (
                      {Array.isArray(post.comments) ? post.comments.length : 0})
                    </span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={() => handleRepost(post)}
                  >
                    <HiOutlineArrowPath className="w-5 h-5" />
                    <span>Repost</span>
                  </button>
                </div>

                {openComments === post.id && (
                  <div className="bg-muted px-4 py-3 border-t border-border">
                    <h5 className="font-semibold mb-3 text-primary">
                      Comments
                    </h5>
                    {Array.isArray(post.comments) &&
                    post.comments.length > 0 ? (
                      <ul className="space-y-3 mb-4">
                        {post.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary text-xs font-bold">
                              {currentUser.avatar.charAt(0)}
                            </div>
                            <div className="flex-1 bg-card rounded-lg p-3 shadow-sm">
                              <div className="font-medium text-sm">
                                {currentUser.name}
                              </div>
                              <div className="text-foreground text-sm mt-1">
                                {comment}
                              </div>
                            </div>
                          </li>
                        ))}
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
                        handleAddComment(post.id, commentInputs[post.id] || "");
                      }}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {currentUser.avatar.charAt(0)}
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
                        ➔
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <aside className="w-full md:w-1/4 space-y-6">
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h3 className="font-bold text-lg">Top Freelancers</h3>
            </div>
            <div className="p-4">
              {filteredFreelancers.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No freelancers found.
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredFreelancers.map((freelancer, index) => (
                    <li
                      key={freelancer.name}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {freelancer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {freelancer.name}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {freelancer.role}
                        </div>
                      </div>
                      {index < 3 && (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? "bg-primary/10 text-primary" : index === 1 ? "bg-muted text-muted-foreground" : "bg-secondary/10 text-secondary"}`}
                        >
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h3 className="font-bold text-lg">Trending Hashtags</h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "ITI",
                  "Freelancing",
                  "WebDev",
                  "ReactJS",
                  "ITIGraduates",
                  "Coding",
                  "UXDesign",
                  "MobileApps",
                  "TechJobs",
                  "RemoteWork",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-primary-foreground">
              <h3 className="font-bold text-lg">Community Guidelines</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start space-x-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                  <span>Be respectful to all members</span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                  <span>Share knowledge and help others</span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                  <span>Keep discussions professional</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <footer className="bg-primary text-primary-foreground py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="/logo.jpeg"
                alt="ITI Logo"
                className="h-10 w-10 object-contain rounded-full border border-border bg-card mr-2"
              />
              <h1 className="text-2xl font-bold">ITI Freelancers Community</h1>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-primary-foreground/80 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} ITI Freelancers Community. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

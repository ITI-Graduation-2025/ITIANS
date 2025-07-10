"use client";
import Head from "next/head";
import { useMemo, useState } from "react";

export default function CommunityPage() {
  const colors = {
    primary: "bg-red-900",
    primaryDark: "bg-[#003d82]",
    primaryLight: "bg-red-100",
    secondary: "bg-red-200",
    accent: "bg-[#dc3545]",
    text: "text-[#212529]",
    lightText: "text-[#6c757d]",
    white: "bg-white",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Ahmed Mohamed",
      role: "Web Developer - ITI Grad",
      content:
        "Just completed a React project for a client. Learned so much about state management with Redux Toolkit! #ITI #Freelancing",
      timestamp: "2 hours ago",
      likes: 14,
      comments: 3,
      isLiked: false,
    },
    {
      id: 2,
      author: "Amira Mostafa",
      role: "UI/UX Designer - ITI Grad",
      content:
        "Sharing my latest Figma design for a mobile app. Would love feedback from fellow ITI designers!",
      timestamp: "5 hours ago",
      likes: 23,
      comments: 7,
      isLiked: true,
    },
  ]);

  const [freelancers] = useState([
    { name: "Ahmed Mohamed", role: "Web Developer" },
    { name: "Amira Mostafa", role: "UI/UX Designer" },
    { name: "Jihane Mohamed", role: "Mobile Developer" },
    { name: "Wafaa Samir", role: "Backend Developer" },
    { name: "Islam Mohamed", role: "Full Stack Developer" },
  ]);

  const [search, setSearch] = useState("");
  const [postContent, setPostContent] = useState("");
  const [openComments, setOpenComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [postAttachment, setPostAttachment] = useState(null);

  const currentUser = {
    name: "Wafaa Samir",
    role: "Web Developer - ITI Grad",
    avatar: "WS",
  };

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

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postAttachment) return;
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      role: currentUser.role,
      content: postContent,
      timestamp: "Just now",
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
    };
    setPosts([newPost, ...posts]);
    setPostContent("");
    setPostAttachment(null);
  };

  const handleLikePost = (postId) => {
    setPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      }),
    );
  };

  const handleRepost = (post) => {
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      role: currentUser.role,
      content: post.content,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      isLiked: false,
      attachment: post.attachment || null,
      repostOf: {
        author: post.author,
        role: post.role,
        content: post.content,
        timestamp: post.timestamp,
        attachment: post.attachment || null,
      },
    };
    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId, comment) => {
    if (!comment.trim()) return;
    setPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: Array.isArray(post.comments)
              ? [...post.comments, comment]
              : [comment],
          };
        }
        return post;
      }),
    );
    setCommentInputs((inputs) => ({ ...inputs, [postId]: "" }));
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${colors.text}`}>
      <Head>
        <title>ITI Freelancers Community</title>
        <meta
          name="description"
          content="The official community for ITI graduates and freelancers to connect, share, and grow together."
        />
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
      </Head>

      <header
        className={`${colors.primary} text-white shadow-md sticky top-0 z-10`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.jpeg"
              alt="ITI Logo"
              className="h-12 w-12 object-contain rounded-full border border-gray-200 bg-white"
            />

            <h1 className="text-2xl font-bold">ITI Freelancers Community</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts or freelancers..."
                className="px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
            </div>
            <button
              className={`p-2 rounded-full hover:${colors.primaryDark} transition-colors`}
            >
              <span className="text-xl">🔔</span>
              <span className="sr-only">Notifications</span>
            </button>
            <div
              className={`h-10 w-10 rounded-full ${colors.primaryDark} flex items-center justify-center text-white font-medium`}
            >
              {currentUser.avatar}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 space-y-6">
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden ${colors.primaryLight} border-l-4 ${colors.primary}`}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`h-16 w-16 rounded-full ${colors.primary} flex items-center justify-center text-white font-bold text-xl`}
                >
                  {currentUser.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentUser.name}</h3>
                  <p className="text-sm text-gray-600">{currentUser.role}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <div className="text-center">
                  <div className="font-bold">42</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">128</div>
                  <div className="text-xs text-gray-500">Connections</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">5</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
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
                    className="flex items-center space-x-3 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${colors.primaryLight} flex items-center justify-center text-blue-800`}
                    >
                      {company.charAt(0)}
                    </div>
                    <span>{company}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
              <h3 className="font-bold text-lg">Upcoming Events</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-4">
                <li className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`min-w-12 h-12 ${colors.secondary} rounded-lg flex items-center justify-center font-bold`}
                    >
                      Jul
                    </div>
                    <div>
                      <div className="font-medium">ITI Alumni Meetup</div>
                      <div className="text-sm text-gray-500">
                        July 15, 2023 • Cairo
                      </div>
                    </div>
                  </div>
                </li>
                <li className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`min-w-12 h-12 ${colors.secondary} rounded-lg flex items-center justify-center font-bold`}
                    >
                      Jul
                    </div>
                    <div>
                      <div className="font-medium">Freelancing Workshop</div>
                      <div className="text-sm text-gray-500">
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
              <h2 className="text-lg font-bold">Create a Post</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleAddPost}>
                <div className="flex items-start space-x-3">
                  <div
                    className={`h-12 w-12 rounded-full ${colors.primary} flex items-center justify-center text-white font-bold`}
                  >
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share your thoughts, projects, or questions..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none"
                      rows={3}
                    />
                    {postAttachment && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {postAttachment.type.startsWith("image") ? (
                            <img
                              src={URL.createObjectURL(postAttachment)}
                              alt="Preview"
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div
                              className={`h-12 w-12 rounded ${colors.primaryLight} flex items-center justify-center`}
                            >
                              <span className="text-blue-600">📄</span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium truncate max-w-xs">
                              {postAttachment.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {postAttachment.type}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setPostAttachment(null)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <label className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
                          <span className="text-lg">📎</span>
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
                        className={`px-6 py-2 rounded-lg ${colors.primary} text-white hover:${colors.primaryDark} transition-colors disabled:opacity-50`}
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
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">
                No posts found matching your search.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {post.repostOf && (
                  <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-sm text-yellow-800">
                    <span className="font-semibold">
                      {post.author} reposted
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`h-12 w-12 rounded-full ${colors.primary} flex items-center justify-center text-white font-bold`}
                    >
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{post.author}</h4>
                          <p className="text-sm text-gray-600">{post.role}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {post.timestamp}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button>
                        </div>
                      </div>

                      {post.repostOf && (
                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`h-8 w-8 rounded-full ${colors.primary} flex items-center justify-center text-white text-xs font-bold`}
                            >
                              {post.repostOf.author.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">
                                {post.repostOf.author}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {post.repostOf.role}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {post.repostOf.timestamp}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-800 text-sm">
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
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  📄 {post.repostOf.attachment.name}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {!post.repostOf && (
                        <>
                          <p className="mt-3 text-gray-800">{post.content}</p>

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
                                  className="inline-flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 text-blue-600 hover:text-blue-800"
                                >
                                  <span className="mr-2">📄</span>
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

                <div className="border-t border-gray-200 px-4 py-2 flex justify-between">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${post.isLiked ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <span className="text-lg">
                      {post.isLiked ? "👍" : "👍"}
                    </span>
                    <span>Like ({post.likes})</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                    onClick={() =>
                      setOpenComments(openComments === post.id ? null : post.id)
                    }
                  >
                    <span className="text-lg">💬</span>
                    <span>
                      Comment (
                      {Array.isArray(post.comments)
                        ? post.comments.length
                        : post.comments}
                      )
                    </span>
                  </button>
                  <button
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                    onClick={() => handleRepost(post)}
                  >
                    <span className="text-lg">🔁</span>
                    <span>Repost</span>
                  </button>
                </div>

                {openComments === post.id && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <h5 className="font-semibold mb-3 text-blue-800">
                      Comments
                    </h5>
                    {Array.isArray(post.comments) &&
                    post.comments.length > 0 ? (
                      <ul className="space-y-3 mb-4">
                        {post.comments.map((comment, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div
                              className={`h-8 w-8 rounded-full ${colors.primaryLight} flex items-center justify-center text-blue-800 text-xs font-bold`}
                            >
                              {currentUser.avatar.charAt(0)}
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                              <div className="font-medium text-sm">
                                {currentUser.name}
                              </div>
                              <div className="text-gray-700 text-sm mt-1">
                                {comment}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-4">
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
                      <div
                        className={`h-10 w-10 rounded-full ${colors.primaryLight} flex items-center justify-center text-blue-800 font-bold flex-shrink-0`}
                      >
                        {currentUser.avatar.charAt(0)}
                      </div>
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
                        className={`h-10 w-10 rounded-full ${colors.primary} text-white flex items-center justify-center hover:${colors.primaryDark} disabled:opacity-50`}
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
              <h3 className="font-bold text-lg">Top Freelancers</h3>
            </div>
            <div className="p-4">
              {filteredFreelancers.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No freelancers found.
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredFreelancers.map((freelancer, index) => (
                    <li
                      key={freelancer.name}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div
                        className={`h-10 w-10 rounded-full ${colors.primary} flex items-center justify-center text-white font-bold`}
                      >
                        {freelancer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {freelancer.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {freelancer.role}
                        </div>
                      </div>
                      {index < 3 && (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? "bg-yellow-100 text-yellow-800" : index === 1 ? "bg-gray-100 text-gray-800" : "bg-amber-100 text-amber-800"}`}
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

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
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
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`p-4 ${colors.primary} text-white`}>
              <h3 className="font-bold text-lg">Community Guidelines</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Be respectful to all members</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Share knowledge and help others</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span>Keep discussions professional</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <footer className={`${colors.primary} text-white py-6 mt-8`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center space-x-4">
                <img
                  src="/logo.jpeg"
                  alt="ITI Logo"
                  className="h-12 w-12 object-contain rounded-full border border-gray-200 bg-white"
                />

                <h2 className="text-2xl font-bold">
                  ITI Freelancers Community
                </h2>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-200 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-yellow-200 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-yellow-200 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-yellow-200 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left text-sm text-blue-100">
            © {new Date().getFullYear()} ITI Freelancers Community. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

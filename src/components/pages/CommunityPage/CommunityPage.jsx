"use client";
import { UserContext } from "@/context/userContext";
import { UsersContext } from "@/context/usersContext";
import { getAllPosts, subscribeToPosts } from "@/services/postServices";
import Head from "next/head";
import { useContext, useEffect, useMemo, useState } from "react";
import CommunityRightSidebar from "./components/CommunityRightSidebar";
import CommunitySidebar from "./components/CommunitySidebar";
import PostCreation from "./components/PostCreation";
import PostList from "./components/PostList";
import Navbar from "@/components/componentts/Navbar";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const { users } = useContext(UsersContext);

  const { user: currentUser } = useContext(UserContext);

  // Load posts from Firebase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getAllPosts();
        setPosts(postsData);
        setAllPosts(postsData);
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
      setAllPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Current user for posting:", currentUser);
  }, [currentUser]);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return allPosts;
    return allPosts.filter(
      (post) =>
        (post.content &&
          post.content.toLowerCase().includes(search.toLowerCase())) ||
        (post.author &&
          post.author.toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, posts, allPosts]);

  const filteredFreelancers = useMemo(() => {
    const freelancers = users
      .filter((user) => user?.role === "freelancer")
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return freelancers;
  }, [users]);

  const filteredCompanies = useMemo(() => {
    const companies = users
      .filter((user) => user?.role === "company")
      .slice(0, 6);

    return companies;
  }, [users]);

  const filteredMentors = useMemo(() => {
    const mentors = users
      .filter((user) => user?.role === "mentor")
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return mentors;
  }, [users]);

  const onSearch = (term) => {
    setSearch(term);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="text-center relative z-10 animate-fade-in-up">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto mb-8"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Loading Community
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Gathering the latest posts and updates from our vibrant ITI community...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      <Navbar onSearch={onSearch} />
      <Head>
        <title>ITI Freelancers Community</title>
        <meta
          name="description"
          content="Community for ITI graduates freelancers"
        />
      </Head>

      {error && (
        <div className="relative z-10 bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-6 mx-auto max-w-7xl mt-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-destructive/20 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button 
                onClick={() => setError(null)} 
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all duration-200 hover:scale-110"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            ITI Community Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and grow with fellow ITI graduates. Share your journey, discover opportunities, and build meaningful connections.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-80 order-2 lg:order-1 animate-slide-in-left">
            <CommunitySidebar
              currentUser={currentUser}
              posts={posts}
              companies={filteredCompanies}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 order-1 lg:order-2 space-y-8 animate-fade-in-up">
            <PostCreation currentUser={currentUser} />
            <PostList
              posts={filteredPosts}
              currentUser={currentUser}
              search={search}
              onSearch={onSearch}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 order-3 animate-slide-in-right">
            <CommunityRightSidebar
              freelancers={filteredFreelancers}
              mentors={filteredMentors}
              search={search}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loading Community</h2>
          <p className="text-slate-500">Gathering the latest posts and updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-foreground">
      <Navbar onSearch={onSearch} />
      <Head>
        <title>ITI Freelancers Community</title>
        <meta
          name="description"
          content="Community for ITI graduates freelancers"
        />
      </Head>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mx-auto max-w-7xl mt-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button 
                onClick={() => setError(null)} 
                className="inline-flex text-red-400 hover:text-red-500 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-7xl">
       

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-80 order-2 lg:order-1">
            <CommunitySidebar
              currentUser={currentUser}
              posts={posts}
              companies={filteredCompanies}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 order-1 lg:order-2 space-y-8">
            <PostCreation currentUser={currentUser} />
            <PostList
              posts={filteredPosts}
              currentUser={currentUser}
              search={search}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 order-3">
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

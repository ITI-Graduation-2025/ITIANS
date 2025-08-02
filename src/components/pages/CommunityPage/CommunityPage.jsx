"use client";
import { UserContext } from "@/context/userContext";
import { UsersContext } from "@/context/usersContext";
import { getAllPosts, subscribeToPosts } from "@/services/postServices";
import Head from "next/head";
import { useContext, useEffect, useMemo, useState } from "react";
import CommunityFooter from "./components/CommunityFooter";
import CommunityHeader from "./components/CommunityHeader";
import CommunityRightSidebar from "./components/CommunityRightSidebar";
import CommunitySidebar from "./components/CommunitySidebar";
import PostCreation from "./components/PostCreation";
import PostList from "./components/PostList";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    console.log("Current user for posting:", currentUser);
  }, [currentUser]);

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

      <CommunityHeader
        search={search}
        setSearch={setSearch}
        currentUser={currentUser}
      />

      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <CommunitySidebar currentUser={currentUser} posts={posts} companies={filteredCompanies} />

        <div className="w-full md:w-2/4 space-y-6">
          <PostCreation currentUser={currentUser} />
          <PostList
            posts={filteredPosts}
            currentUser={currentUser}
            search={search}
          />
        </div>

        <CommunityRightSidebar
          freelancers={filteredFreelancers}
          search={search}
        />
      </main>

      {/* <CommunityFooter /> */}
    </div>
  );
}

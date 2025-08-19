"use client";

import { useEffect, useState } from "react";
import { getPost } from "@/services/postServices";
import PostDetails from "@/components/pages/CommunityPage/components/PostDetails";
import { useParams } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Link from "next/link";
import { HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi2";

export default function PostDetailsPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        const postData = await getPost(postId);
        if (postData) {
          setPost(postData);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Post Skeleton */}
          <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center space-x-6">
                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link 
              href="/" 
              className="flex items-center hover:text-gray-700 transition-colors"
            >
              <HiOutlineHome className="w-4 h-4 mr-1" />
              Home
            </Link>
            <HiOutlineChevronRight className="w-4 h-4" />
            <Link 
              href="/community" 
              className="hover:text-gray-700 transition-colors"
            >
              Community
            </Link>
          </nav>
          
          <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm p-12 text-center">
            <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {error || "Post not found"}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto mb-8">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/community"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Back to Community
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-muted/30 text-muted-foreground rounded-xl font-medium hover:bg-muted/50 hover:text-foreground transition-all duration-200"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link 
            href="/" 
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <HiOutlineHome className="w-4 h-4 mr-1" />
            Home
          </Link>
          <HiOutlineChevronRight className="w-4 h-4" />
          <Link 
            href="/community" 
            className="hover:text-gray-700 transition-colors"
          >
            Community
          </Link>
          <HiOutlineChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Post Details</span>
        </nav>

        {/* Post Details */}
        <div className="space-y-6">
          <PostDetails post={post} currentUser={currentUser} />
          
          {/* Related Posts Suggestion */}
          <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Explore More</h3>
              <p className="text-muted-foreground mb-4">Discover other interesting posts in the community</p>
              <Link
                href="/community"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

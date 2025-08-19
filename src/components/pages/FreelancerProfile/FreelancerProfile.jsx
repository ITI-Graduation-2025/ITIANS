"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { updateUser } from "@/services/userServices";
import { getAllPosts, subscribeToPosts } from "@/services/postServices";
import { uploadDocument } from "@/utils/upload";
import {
  Certificates,
  EditModal,
  FinishedJobs,
  InProgressJobs,
  Header,
  Experience,
  PersonalInfo,
  Posts,
  ResumeSection,
  Skills,
} from "./components";

const FreelancerProfile = ({ user, refetchUser }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(null);
  const fileInputRef = useRef();
  const [userPosts, setUserPosts] = useState([]);
  const [resumeUrl, setResumeUrl] = useState();

  useEffect(() => {
    async function fetchPosts() {
      if (user && user.id) {
        console.log("Fetching posts for user:", {
          userId: user.id,
          userUid: user.uid,
          userName: user.name || user.fullName,
          userData: user
        });
        
        const allPosts = await getAllPosts();
        console.log("All posts:", allPosts.map(p => ({ id: p.id, authorId: p.authorId, author: p.author })));
        
        // Filter posts by both user.id and user.uid to handle potential ID format mismatches
        // Also check if there's a uid field in the user document data
        const filteredPosts = allPosts.filter((post) => {
          const matchesId = post.authorId === user.id;
          const matchesUid = post.authorId === user.uid;
          const matchesDocumentUid = post.authorId === user.uid; // Check if user document has uid field
          const isMatch = matchesId || matchesUid || matchesDocumentUid;
          
          if (isMatch) {
            console.log("Post matches user:", { 
              postId: post.id, 
              authorId: post.authorId, 
              author: post.author,
              matchType: matchesId ? 'id' : matchesUid ? 'uid' : 'documentUid'
            });
          }
          
          return isMatch;
        });
        
        console.log("Filtered posts count:", filteredPosts.length);
        console.log("User ID comparison:", {
          userId: user.id,
          userUid: user.uid,
          postAuthorIds: allPosts.map(p => p.authorId),
          hasMatchingPosts: filteredPosts.length > 0
        });
        
        // If no posts found, log additional debugging info
        if (filteredPosts.length === 0 && allPosts.length > 0) {
          console.warn("No posts found for user. Debugging info:", {
            userId: user.id,
            userUid: user.uid,
            totalPosts: allPosts.length,
            samplePostAuthorIds: allPosts.slice(0, 5).map(p => p.authorId),
            userObject: user
          });
        }
        
        setUserPosts(filteredPosts);
      }
    }
    fetchPosts();
    setResumeUrl(user?.resumeUrl);
  }, [user]);

  // Subscribe to real-time post updates
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToPosts((updatedPosts) => {
      // Filter updated posts for the profile owner using the same logic
      const filteredPosts = updatedPosts.filter((post) => {
        const matchesId = post.authorId === user.id;
        const matchesUid = post.authorId === user.uid;
        const matchesDocumentUid = post.authorId === user.uid; // Check if user document has uid field
        return matchesId || matchesUid || matchesDocumentUid;
      });
      
      setUserPosts(filteredPosts);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const certificates = user.certificates || [];
  const isOwner = session?.user?.id === user.id;

  // Resume upload handler
  async function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Upload document to Cloudinary
      const documentUrl = await uploadDocument(e);
      
      // Save the Cloudinary URL to user profile
      await updateUser(user.id, { resumeUrl: documentUrl });
      
      // Update local state immediately
      setResumeUrl(documentUrl);
      
      // Update user object locally to avoid refresh
      user.resumeUrl = documentUrl;
      
      // Refetch user data in background
      await refetchUser();
    } catch (error) {
      console.error("Resume upload error:", error);
      throw error; // Re-throw to be handled by the component
    }
  }

  async function handleResumeDelete() {
    try {
      await updateUser(user.id, { resumeUrl: "" });
      
      // Update local state immediately
      setResumeUrl(null);
      
      // Update user object locally to avoid refresh
      user.resumeUrl = "";
      
      // Refetch user data in background
      await refetchUser();
    } catch (error) {
      console.error("Resume delete error:", error);
      throw error; // Re-throw to be handled by the component
    }
  }

  // Dynamic fields from user object
  const id = user.id;
  const profileImage = user.profileImage || "https://i.pravatar.cc/100?img=5";
  const fullName = user.name || user.fullName || "No Name";
  const email = user.email || "No Email";
  const jobTitle = user.jobTitle || "Freelancer";
  const education = user.education || {};
  const mainTrack = user.mainTrack || "";
  const skills = user.skills || [];
  const finishedJobs = user.finishedJobs || [];
  const inProgressJobs = user.inProgressJobs || [];
  const currentJob = user.currentJob;
  const linkedIn = user.linkedIn || "";
  const github = user.github || "";
  const bio = user.bio || "";
  const status = user.status || user.verificationStatus || "";
  const rating = user.rating || null;

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Background */}
      <div className="h-64 bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>
      
      <main className="-mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
        <PersonalInfo
          id={id}
          profileImage={profileImage}
          fullName={fullName}
          jobTitle={jobTitle}
          email={email}
          status={status}
          rating={rating}
          mainTrack={mainTrack}
          currentJob={currentJob}
          bio={bio}
          education={education}
          linkedIn={linkedIn}
          github={github}
          isOwner={isOwner}
          setIsModalOpen={setIsModalOpen}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Skills & Resume & Certificates */}
          <div className="xl:col-span-1 space-y-6">
            <Skills skills={skills} isOwner={isOwner} setIsModalOpen={setIsModalOpen} />
            <ResumeSection
              userName={fullName}
              resumeUrl={resumeUrl}
              isOwner={isOwner}
              handleResumeUpload={handleResumeUpload}
              handleResumeDelete={handleResumeDelete}
              fileInputRef={fileInputRef}
            />
            <Certificates
              certificates={certificates}
              isOwner={isOwner}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
          
          {/* Right Column - Experience & Jobs & Posts */}
          <div className="xl:col-span-2 space-y-6">
            <Experience
              workExperiences={user.workExperiences || []}
              experienceYears={user.experienceYears}
              experienceMonths={user.experienceMonths}
              isOwner={isOwner}
              setIsModalOpen={setIsModalOpen}
            />
            <FinishedJobs
              finishedJobs={finishedJobs}
              isOwner={isOwner}
              setIsModalOpen={setIsModalOpen}
            />
            <InProgressJobs
              inProgressJobs={inProgressJobs}
              currentJob={currentJob}
              isOwner={isOwner}
              setIsModalOpen={setIsModalOpen}
            />
            <Posts userPosts={userPosts} currentUser={session?.user} isOwner={isOwner} userName={fullName} />
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <EditModal
          type={isModalOpen}
          onClose={() => setIsModalOpen(null)}
          user={user}
          refetchUser={refetchUser}
        />
      )}
    </div>
  );
};

export default FreelancerProfile;

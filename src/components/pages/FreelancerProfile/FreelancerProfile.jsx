"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { getAllPosts, updateUser } from "@/services/firebase";
import {
  Certificates,
  EditModal,
  FinishedJobs,
  Header,
  PersonalInfo,
  Posts,
  ResumeSection,
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
        const allPosts = await getAllPosts();
        setUserPosts(allPosts.filter((post) => post.authorId === user.id));
      }
    }
    fetchPosts();
    setResumeUrl(user?.resumeUrl);
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
    // For demo: just store file as base64 in Firestore (in real app, upload to storage and save URL)
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateUser(user.id, { resumeUrl: reader.result });
      await refetchUser();
      setResumeUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleResumeDelete() {
    await updateUser(user.id, { resumeUrl: "" });
    await refetchUser();
    setResumeUrl();
  }

  // Dynamic fields from user object
  const profileImage = user.profileImage || "https://i.pravatar.cc/100?img=5";
  const fullName = user.name || user.fullName || "No Name";
  const email = user.email || "No Email";
  const jobTitle = user.jobTitle || "Freelancer";
  const education = user.education || {};
  const mainTrack = user.mainTrack || "";
  const skills = user.skills || [];
  const finishedJobs = user.finishedJobs || [];
  const currentJob = user.currentJob;
  const linkedIn = user.linkedIn || "";
  const github = user.github || "";
  const bio = user.bio || "";
  const status = user.status || user.verificationStatus || "";
  const rating = user.rating || null;

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Header profileImage={profileImage} fullName={fullName} email={email} />
      <div className="h-48 bg-gradient-to-r from-[#B71C1C] to-red-300" />
      <main className="-mt-20 max-w-3xl mx-auto px-4 space-y-8">
        <PersonalInfo
          profileImage={profileImage}
          fullName={fullName}
          jobTitle={jobTitle}
          email={email}
          status={status}
          rating={rating}
          mainTrack={mainTrack}
          skills={skills}
          currentJob={currentJob}
          bio={bio}
          education={education}
          linkedIn={linkedIn}
          github={github}
          isOwner={isOwner}
          setIsModalOpen={setIsModalOpen}
        />
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
        <Posts userPosts={userPosts} />
        <FinishedJobs
          finishedJobs={finishedJobs}
          isOwner={isOwner}
          setIsModalOpen={setIsModalOpen}
        />
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

"use client";

import React, { useState, useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown/page";
import CertificateSelect from "../CertificateSelect/Page"
import { FiEdit } from "react-icons/fi";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaCertificate,
  FaBriefcase,
  FaDollarSign,
} from "react-icons/fa";
import { useUserContext } from "@/context/userContext";
import { useSession } from "next-auth/react";
import { updateUser } from "@/services/firebase";
import { useRef } from "react";
import { getAllPosts } from "@/services/firebase";

export default function Profile() {
  const { user, refetchUser } = useUserContext();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      if (user && user.id) {
        const allPosts = await getAllPosts();
        setUserPosts(allPosts.filter(post => post.authorId === user.id));
      }
    }
    fetchPosts();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const resumeUrl = user.resumeUrl || "";
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
    };
    reader.readAsDataURL(file);
  }

  async function handleResumeDelete() {
    await updateUser(user.id, { resumeUrl: "" });
    await refetchUser();
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
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9afXVML2UMaMFwb3fzaIxlIxIlm2EkVefeQ&s"
            alt="ITI"
            className="h-10"
          />
          <nav className="flex gap-6 text-sm text-gray-700">
            <a href="#" className="text-[#B71C1C] font-medium hover:underline">
              Find Work
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              My Jobs
            </a>
            <a href="#" className="hover:text-[#B71C1C] hover:underline">
              Messages
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2 relative">
          <img
            src={profileImage}
            alt={fullName}
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <div>
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          {showDropdown && (
            <div className="absolute top-10 right-0 z-50">
              <ProfileDropdown />
            </div>
          )}
        </div>
      </header>

      <div className="h-48 bg-gradient-to-r from-[#B71C1C] to-red-300" />

      <main className="-mt-20 max-w-3xl mx-auto px-4 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-4 relative">
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              alt={fullName}
              className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold text-[#B71C1C]">
                {fullName}
              </h1>
              <p className="text-black text-sm">{jobTitle}</p>
              <p className="text-black flex items-center gap-1 text-sm">
                <FaEnvelope /> {email}
              </p>
              {status && (
                <p className="text-xs text-gray-500 mt-1">Status: {status}</p>
              )}
              {rating && (
                <p className="text-xs text-gray-500 mt-1">Rating: {rating}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between text-center">
            <div>
              <p className="text-xs text-gray-500">Main Track</p>
              <p className="text-base font-semibold text-[#B71C1C]">{mainTrack}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Skills</p>
              <p className="text-base font-semibold text-[#B71C1C]">
                {skills.length ? skills.map(s => s.value || s).join(", ") : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Job</p>
              <p className="text-base font-semibold text-[#B71C1C]">
                {typeof currentJob === "string" && currentJob ? currentJob : "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <ProfileItem
              title="About Me"
              value={bio}
              onEdit={isOwner ? () => setIsModalOpen("about") : undefined}
              editable={isOwner}
            />
            <ProfileItem
              title="Education"
              value={education.school ? `${education.school} - ${education.degree} (${education.year})` : "-"}
              onEdit={isOwner ? () => setIsModalOpen("education") : undefined}
              editable={isOwner}
            />
            <ProfileItem
              title="LinkedIn"
              value={linkedIn ? <a href={linkedIn} target="_blank" rel="noreferrer">{linkedIn}</a> : "-"}
              onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
              editable={isOwner}
            />
            <ProfileItem
              title="GitHub"
              value={github ? <a href={github} target="_blank" rel="noreferrer">{github}</a> : "-"}
              onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
              editable={isOwner}
            />
          </div>
        </div>

        {/* Resume Section */}
        <ModernSection
          icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
          title="Resume"
          value={resumeUrl ? (
            <div className="flex flex-col gap-2">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Resume</a>
              {isOwner && (
                <button onClick={handleResumeDelete} className="text-red-500 underline text-left">Delete Resume</button>
              )}
            </div>
          ) : (
            isOwner ? (
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">Upload your resume (PDF, DOCX)</p>
              </div>
            ) : <span>No resume uploaded</span>
          )}
          editable={isOwner}
        />

        {/* Certificates Section */}
        <ModernSection
          icon={<FaCertificate className="text-[#B71C1C] text-xl" />}
          title="Certificates"
          value={certificates.length ? certificates.map((c, i) => (
            <div key={i} className="text-sm">
              {c.title} {c.year && `(${c.year})`}
            </div>
          )) : <div className="text-sm">No certificates</div>}
          onEdit={isOwner ? () => setIsModalOpen("certificates") : undefined}
          editable={isOwner}
        />

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-8">
          <h2 className="text-lg font-bold text-[#B71C1C] mb-4">Posts</h2>
          {userPosts.length === 0 ? (
            <div className="text-gray-500">No posts yet.</div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-black">{post.content}</span>
                    <span className="text-xs text-gray-400">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
                  </div>
                  {post.attachment && post.attachment.type && post.attachment.type.startsWith('image') && (
                    <img src={post.attachment.url} alt="Attachment" className="max-h-48 rounded mt-2" />
                  )}
                  {post.attachment && post.attachment.type && !post.attachment.type.startsWith('image') && (
                    <a href={post.attachment.url} download={post.attachment.name} className="inline-flex items-center text-blue-600 underline mt-2">
                      {post.attachment.name}
                    </a>
                  )}
                  {post.repostOf && (
                    <div className="mt-2 text-xs text-gray-500">
                      Repost of: {post.repostOf.author} - {post.repostOf.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finished Jobs Section */}
        <ModernSection
          icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
          title="Finished Jobs"
          value={finishedJobs.length ? finishedJobs.map((job, i) => (
            <div key={i} className="text-sm">
              {job.role} at {job.company} ({job.date})<br />
              {job.details} - {job.price}
            </div>
          )) : <div className="text-sm">No finished jobs</div>}
          onEdit={isOwner ? () => setIsModalOpen("work") : undefined}
          editable={isOwner}
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
}

function ProfileItem({ title, value, onEdit, editable }) {
  return (
    <div>
      <p className="text-[#B71C1C] font-medium">{title}</p>
      <p className="text-black flex justify-between items-center">
        {value}
        {editable && onEdit && (
          <button className="text-gray-400 hover:text-[#B71C1C]" onClick={onEdit}>
            <FiEdit />
          </button>
        )}
      </p>
    </div>
  );
}

function ModernSection({ icon, title, value, onEdit, editable }) {
  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-[#B71C1C]">{title}</h2>
        </div>
        {editable && onEdit && (
          <button className="text-gray-400 hover:text-[#B71C1C]" onClick={onEdit}>
            <FiEdit />
          </button>
        )}
      </div>
      <div className="mt-2 text-black">{value}</div>
    </div>
  );
}

function WorkHistorySection({ completedJobs, inProgressJobs }) {
  const [activeTab, setActiveTab] = useState("completed");
  const jobs = activeTab === "completed" ? completedJobs : inProgressJobs;

  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <FaBriefcase className="text-[#B71C1C] text-xl" />
          <h2 className="text-lg font-semibold text-[#B71C1C]">Work History</h2>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-4 mb-2">
          <button
            className={`text-sm px-3 py-1 rounded ${
              activeTab === "completed"
                ? "bg-[#B71C1C] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Jobs
          </button>
          <button
            className={`text-sm px-3 py-1 rounded ${
              activeTab === "inProgress"
                ? "bg-[#B71C1C] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => setActiveTab("inProgress")}
          >
            In Progress
          </button>
        </div>

        {jobs.map((job, i) => (
          <div
            key={i}
            className="mb-3 p-3 bg-gray-50 rounded border text-sm text-black"
          >
            <div className="flex justify-between font-medium text-[#B71C1C]">
              <span>
                {job.role} at {job.company}
              </span>
              <span className="text-xs text-gray-600">{job.date}</span>
            </div>
            <div className="mt-1">{job.details}</div>

            {activeTab === "completed" && job.price && (
              <div className="mt-1 text-sm text-gray-800">
                <FaDollarSign /> {job.price}
              </div>
            )}
            {activeTab === "inProgress" && job.expectedEnd && (
              <div className="mt-1 text-xs text-gray-500">
                Expected Completion: {job.expectedEnd}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


function EditModal({ type, onClose, user, refetchUser }) {
  const [tempValue, setTempValue] = React.useState("");
  useEffect(() => {
    if (type === "about") setTempValue(user.bio || "");
    else if (type === "links") setTempValue({ github: user.github || "", linkedIn: user.linkedIn || "" });
    else if (type === "education") setTempValue(user.education || { school: "", degree: "", year: "" });
    else if (type === "work") setTempValue(user.finishedJobs || []);
    else if (type === "certificates") setTempValue(user.certificates || []);
  }, [type, user]);

  const handleSave = async () => {
    if (type === "about") {
      await updateUser(user.id, { bio: tempValue });
    } else if (type === "links") {
      await updateUser(user.id, { github: tempValue.github, linkedIn: tempValue.linkedIn });
    } else if (type === "education") {
      await updateUser(user.id, { education: tempValue });
    } else if (type === "work") {
      await updateUser(user.id, { finishedJobs: tempValue });
    } else if (type === "certificates") {
      await updateUser(user.id, { certificates: tempValue });
    }
    await refetchUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 space-y-4 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold capitalize">Edit {type}</h2>
        {type === "about" && (
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
          />
        )}
        {type === "links" && (
          <>
            <input
              type="url"
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="GitHub Profile"
              value={tempValue.github || ""}
              onChange={e => setTempValue({ ...tempValue, github: e.target.value })}
            />
            <input
              type="url"
              className="w-full border px-3 py-2 rounded"
              placeholder="LinkedIn Profile"
              value={tempValue.linkedIn || ""}
              onChange={e => setTempValue({ ...tempValue, linkedIn: e.target.value })}
            />
          </>
        )}
        {type === "education" && (
          <>
            <input
              type="text"
              placeholder="School / University"
              value={tempValue.school || ""}
              onChange={e => setTempValue({ ...tempValue, school: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Degree / Major"
              value={tempValue.degree || ""}
              onChange={e => setTempValue({ ...tempValue, degree: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Year of Graduation"
              value={tempValue.year || ""}
              onChange={e => setTempValue({ ...tempValue, year: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}
        {type === "certificates" && (
          <>
            {(Array.isArray(tempValue) ? tempValue : []).map((c, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={c.title || ""}
                  onChange={e => {
                    const arr = [...tempValue];
                    arr[i] = { ...arr[i], title: e.target.value };
                    setTempValue(arr);
                  }}
                  placeholder="Certificate Title"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="number"
                  value={c.year || ""}
                  onChange={e => {
                    const arr = [...tempValue];
                    arr[i] = { ...arr[i], year: e.target.value };
                    setTempValue(arr);
                  }}
                  placeholder="Year"
                  className="border px-2 py-1 rounded w-24"
                />
                <button onClick={() => setTempValue(tempValue.filter((_, idx) => idx !== i))} className="text-red-500">Delete</button>
              </div>
            ))}
            <button onClick={() => setTempValue([...(tempValue || []), { title: "", year: "" }])} className="text-blue-600 underline">Add Certificate</button>
          </>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#B71C1C] text-white rounded text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}




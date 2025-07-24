"use client";
import { FaEnvelope } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export const PersonalInfo = ({
  profileImage,
  fullName,
  jobTitle,
  email,
  status,
  rating,
  mainTrack,
  skills,
  currentJob,
  bio,
  education,
  linkedIn,
  github,
  isOwner,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className="flex items-center gap-4">
        <img
          src={profileImage}
          alt={fullName}
          className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-sm"
        />
        <div>
          <h1 className="text-xl font-bold text-[#B71C1C]">{fullName}</h1>
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
            {skills.length ? skills.map((s) => s.value || s).join(", ") : "-"}
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
          value={
            education.school
              ? `${education.school} - ${education.degree} (${education.year})`
              : "-"
          }
          onEdit={isOwner ? () => setIsModalOpen("education") : undefined}
          editable={isOwner}
        />
        <ProfileItem
          title="LinkedIn"
          value={
            linkedIn ? (
              <a href={linkedIn} target="_blank" rel="noreferrer">
                {linkedIn}
              </a>
            ) : (
              "-"
            )
          }
          onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
          editable={isOwner}
        />
        <ProfileItem
          title="GitHub"
          value={
            github ? (
              <a href={github} target="_blank" rel="noreferrer">
                {github}
              </a>
            ) : (
              "-"
            )
          }
          onEdit={isOwner ? () => setIsModalOpen("links") : undefined}
          editable={isOwner}
        />
      </div>
    </div>
  );
};

function ProfileItem({ title, value, onEdit, editable }) {
  return (
    <div>
      <p className="text-[#B71C1C] font-medium">{title}</p>
      <p className="text-black flex justify-between items-center">
        {value}
        {editable && onEdit && (
          <button
            className="text-gray-400 hover:text-[#B71C1C]"
            onClick={onEdit}
          >
            <FiEdit />
          </button>
        )}
      </p>
    </div>
  );
}

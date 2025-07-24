"use client";
import { FaBriefcase } from "react-icons/fa";
import { SectionCard } from "./SectionCard";

export const ResumeSection = ({
  isOwner,
  resumeUrl,
  handleResumeUpload,
  handleResumeDelete,
  fileInputRef,
}) => {
  return (
    <SectionCard
      icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
      title="Resume"
      value={
        resumeUrl ? (
          <div className="flex flex-col gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Resume
            </a>
            {isOwner && (
              <button
                onClick={handleResumeDelete}
                className="text-red-500 underline text-left"
              >
                Delete Resume
              </button>
            )}
          </div>
        ) : isOwner ? (
          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              onChange={handleResumeUpload}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              Upload your resume (PDF, DOCX)
            </p>
          </div>
        ) : (
          <span>No resume uploaded</span>
        )
      }
      editable={isOwner}
    />
  );
};

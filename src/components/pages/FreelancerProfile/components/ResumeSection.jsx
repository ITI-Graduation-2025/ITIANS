"use client";
import { FaBriefcase } from "react-icons/fa";
import { SectionCard } from "./SectionCard";
import { useState } from "react";
import { toast } from "sonner";

export const ResumeSection = ({
  userName,
  isOwner,
  resumeUrl,
  handleResumeUpload,
  handleResumeDelete,
  fileInputRef,
}) => {
  const [uploading, setUploading] = useState(false);

  const onUpload = async (e) => {
    setUploading(true);
    try {
      await handleResumeUpload(e);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    setUploading(true);
    try {
      await handleResumeDelete();
      toast.success("Resume deleted.");
    } catch (err) {
      toast.error("Failed to delete resume.");
    } finally {
      setUploading(false);
    }
  };

  const downloadResume = async () => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use default
      const filename = userName || 'resume.pdf';
      link.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download resume.");
    }
  };

  return (
    <SectionCard
      icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
      title="Resume"
      value={
        resumeUrl ? (
          <div className="flex flex-col gap-2">
            <button
              className="bg-[#B71C1C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#B71C1C]/90 transition-colors flex items-center gap-2"
              onClick={downloadResume}
              disabled={uploading}
            >
              Download Resume
            </button>
            {isOwner && (
              <button
                onClick={onDelete}
                className="text-red-500 underline text-left mt-1 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? "Deleting..." : "Delete Resume"}
              </button>
            )}
          </div>
        ) : isOwner ? (
          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              onChange={onUpload}
              className="mb-2"
              disabled={uploading}
            />
            {uploading && <div className="text-[#B71C1C] text-sm">Uploading...</div>}
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

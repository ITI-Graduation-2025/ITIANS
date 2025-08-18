"use client";
import { FaBriefcase } from "react-icons/fa";
import { SectionCard } from "./SectionCard";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ResumeEditModal } from "./ResumeEditModal";
import { ResumeUploadModal } from "./ResumeUploadModal";

export const ResumeSection = ({
  userName,
  isOwner,
  resumeUrl,
  handleResumeUpload,
  handleResumeDelete,
  fileInputRef,
}) => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const editFileInputRef = useRef();

  const onUpload = async (e) => {
    setUploading(true);
    try {
      await handleResumeUpload(e);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "Failed to upload resume.";
      toast.error(errorMessage);
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
    setDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Cloudinary URL or use default
      let filename = `${userName || 'user'}_resume`;
      
      // Try to get the original filename from Cloudinary URL
      const urlParts = resumeUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.includes('.')) {
        const extension = lastPart.split('.').pop();
        filename = `${userName || 'user'}_resume.${extension}`;
      } else {
        // Default to PDF if no extension found
        filename = `${userName || 'user'}_resume.pdf`;
      }
      
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
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Resume</h2>
            <p className="text-slate-600 text-sm">Professional experience & qualifications</p>
          </div>
        </div>

        {resumeUrl ? (
          <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{userName}'s Resume</p>
                  <p className="text-sm text-slate-600">Ready for download</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadResume}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </>
                )}
              </button>
              
              {isOwner && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Resume
                </button>
              )}
            </div>
          </div>
        ) : isOwner ? (
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Resume Uploaded</h3>
            <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
              Upload your resume to showcase your professional experience and qualifications to potential clients
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                Upload Resume
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onUpload}
              className="hidden"
            />
            
            {/* Hidden file input for edit functionality */}
            <input
              ref={editFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No resume available</p>
          </div>
        )}
      </div>
      
      {/* Resume Edit Modal */}
      <ResumeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resumeUrl={resumeUrl}
        userName={userName}
        onResumeUpload={handleResumeUpload}
        onResumeDelete={handleResumeDelete}
      />
      
      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onResumeUpload={handleResumeUpload}
      />
    </div>
  );
};

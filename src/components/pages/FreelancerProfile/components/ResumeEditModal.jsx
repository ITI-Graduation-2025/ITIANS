"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Upload, Trash2, AlertTriangle } from "lucide-react";

export const ResumeEditModal = ({ 
  isOpen, 
  onClose, 
  resumeUrl, 
  userName, 
  onResumeUpload, 
  onResumeDelete 
}) => {
  const fileInputRef = useRef();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    try {
      await onResumeUpload(e);
      toast.success("Resume updated successfully!");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "Failed to update resume.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await onResumeDelete();
      toast.success("Resume deleted successfully!");
      setShowDeleteModal(false);
      onClose();
    } catch (err) {
      toast.error("Failed to delete resume.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Edit Resume</h2>
            <p className="text-slate-600 text-sm">Manage your professional resume</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {resumeUrl ? (
            <div className="space-y-6">
              {/* Current Resume Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{userName}'s Resume</p>
                    <p className="text-sm text-slate-600">Currently uploaded</p>
                  </div>
                </div>
                
                {/* Resume Preview */}
                <div className="w-full h-48 border border-slate-300 rounded-lg overflow-hidden">
                  <iframe
                    src={`${resumeUrl}#toolbar=0`}
                    className="w-full h-full"
                    title="Resume Preview"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
                >
                  <Upload className="w-4 h-4" />
                  Replace Resume
                </button>
                
                                 <button
                   onClick={() => setShowDeleteModal(true)}
                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium border border-red-200 hover:border-red-300"
                 >
                   <Trash2 className="w-4 h-4" />
                   Delete Resume
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-3">No Resume Uploaded</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Upload your resume to showcase your professional experience and qualifications
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Resume
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
                     />
         </div>
       </div>

       {/* Delete Confirmation Modal */}
       {showDeleteModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
             <div className="text-center">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle className="w-8 h-8 text-red-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Resume</h3>
               <p className="text-slate-600 mb-6">
                 Are you sure you want to delete your resume? This action cannot be undone.
               </p>
               
               <div className="flex gap-3">
                 <button
                   onClick={() => setShowDeleteModal(false)}
                   className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleDelete}
                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                 >
                   Delete
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

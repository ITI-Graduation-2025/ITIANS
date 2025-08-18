"use client";
import { useState, useRef } from "react";
import { createPost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import { toast } from "sonner";
import { X, Plus, Image, FileText } from "lucide-react";

export const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onPostCreated 
}) => {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB for documents, 5MB for images)
    const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploadingFile(true);
    try {
      // Create a preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile(reader.result);
        };
        reader.readAsDataURL(file);
      }

      // Upload to Cloudinary
      const fileUrl = await upload(e);
      setSelectedFile(fileUrl);
      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload file. Please try again.");
      setSelectedFile(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim() && !selectedFile) {
      toast.error('Please add some content or a file');
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        content: postContent.trim(),
        author: currentUser?.name || "Unknown",
        authorId: currentUser?.uid || currentUser?.id,
        authorProfileImage: currentUser?.profileImage || "",
        role: currentUser?.role || "Freelancer",
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      if (selectedFile) {
        // Get the original file to determine type and name
        const file = fileInputRef.current?.files[0];
        postData.attachment = {
          url: selectedFile,
          type: file?.type || "application/octet-stream",
          name: file?.name || "file",
        };
      }

      await createPost(postData);
      toast.success("Post created successfully!");
      onPostCreated();
      handleClose();
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPostContent("");
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Create New Post</h2>
              <p className="text-slate-600 text-sm">Share your thoughts with the community</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Post Content */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              What's on your mind?
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 min-h-[120px]"
              placeholder="Share your thoughts, achievements, or updates with the community..."
            />
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Express yourself freely</span>
              <span className={`font-medium ${postContent.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                {postContent.length}/500
              </span>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Add File (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-all duration-200 disabled:opacity-50"
              >
                <Image className="w-5 h-5" />
                {uploadingFile ? 'Uploading...' : 'Choose File'}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Images: JPG, PNG, GIF • Documents: PDF, DOC, TXT • Max: 5MB (images), 10MB (documents)
              </p>
            </div>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                File Preview
              </label>
              <div className="relative inline-block">
                {selectedFile.startsWith('data:image') || selectedFile.includes('image') ? (
                  <img
                    src={selectedFile}
                    alt="Selected file"
                    className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-slate-200"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <button
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                  title="Remove file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <FileText className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Posting Tips</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Share your achievements and milestones</li>
                  <li>• Ask questions to engage the community</li>
                  <li>• Post about interesting projects you're working on</li>
                  <li>• Keep content professional and respectful</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200/50 bg-slate-50/50">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={(!postContent.trim() && !selectedFile) || isSubmitting}
            className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

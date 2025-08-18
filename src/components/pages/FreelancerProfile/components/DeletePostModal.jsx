"use client";
import { useState } from "react";
import { deletePost } from "@/services/postServices";
import { toast } from "sonner";
import { X, Trash2, AlertTriangle, AlertCircle } from "lucide-react";

export const DeletePostModal = ({ 
  isOpen, 
  onClose, 
  post, 
  onPostDeleted 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !post) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully!");
      onPostDeleted();
      onClose();
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Delete Post</h2>
              <p className="text-slate-600 text-sm">This action cannot be undone</p>
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
        <div className="p-6">
          {/* Warning Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Are you sure you want to delete this post?
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              This action will permanently remove your post from the community. 
              All likes, comments, and interactions will be lost.
            </p>
          </div>

          {/* Post Preview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 mb-1">Post Preview:</p>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {post.content || "No content"}
                </p>
                {post.attachment && post.attachment.type && post.attachment.type.startsWith("image") && (
                  <div className="mt-2">
                    <img
                      src={post.attachment.url}
                      alt="Post attachment"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Warning */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">Important Note</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Deleting this post will also remove it from any reposts or shared content. 
                  This action is irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200/50 bg-slate-50/50">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              'Delete Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useRef } from "react";
import { updatePost, deletePost } from "@/services/postServices";
import { upload } from "@/utils/upload";
import { toast } from "sonner";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineXMark, HiOutlinePhoto, HiOutlineArrowDownTray } from "react-icons/hi2";

export const Posts = ({ userPosts = [], currentUser, isOwner }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const editImageRef = useRef();

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content || "");
    setEditImage(post.attachment?.url || null);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() && !editImage) return;

    try {
      const updateData = {
        content: editContent,
      };

      if (editImage) {
        updateData.attachment = {
          url: editImage,
          type: "image/jpeg", // Default type, you might want to store the actual type
          name: "image.jpg",
        };
      } else {
        updateData.attachment = null;
      }

      await updatePost(editingPost, updateData);
      setEditingPost(null);
      setEditContent("");
      setEditImage(null);
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;

    try {
      await deletePost(postId);
      setDeletingPost(null);
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const showDeleteModal = (postId) => {
    setDeletingPost(postId);
  };

  const hideDeleteModal = () => {
    setDeletingPost(null);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditContent("");
    setEditImage(null);
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await upload(e);
      setEditImage(imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
      setEditImage(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    if (editImageRef.current) {
      editImageRef.current.value = "";
    }
  };

  const isPostOwner = (post) => {
    const currentUserId = currentUser?.uid || currentUser?.id;
    const postAuthorId = post.authorId;
    return currentUserId === postAuthorId;
  };

  const downloadFile = async (url, filename) => {
    try {
      // Use our API endpoint to handle the download
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (err) {
      console.error("Download error:", err);
      // Fallback: open in new tab
      window.open(url, '_blank');
      toast.info("File opened in new tab. You can save it from there.");
    }
  };

  const getFileExtension = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = pathname.split('.').pop();
      return extension || 'jpg'; // Default to jpg for images
    } catch {
      return 'jpg';
    }
  };

  const getFileName = (post, attachment) => {
    if (attachment?.name) {
      return attachment.name;
    }
    
    const extension = getFileExtension(attachment?.url || '');
    const timestamp = new Date().getTime();
    return `post_${post.id}_${timestamp}.${extension}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Community Posts</h2>
            <p className="text-slate-600 text-sm">
              {userPosts.length} post{userPosts.length !== 1 ? 's' : ''} • Community engagement
            </p>
          </div>
        </div>

        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post, index) => (
              <div
                key={post.id || index}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-5 hover:from-primary/5 hover:to-primary/10 hover:border-primary/200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Community Post</p>
                      <p className="text-xs text-slate-500">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPost(post.id)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all duration-200"
                        title="Edit post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => showDeleteModal(post.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Delete post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                {editingPost === post.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="What's on your mind?"
                    />
                    
                    {/* Edit Image Section */}
                    {post.image && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">Current Image:</p>
                        <div className="relative inline-block">
                          <img
                            src={post.image}
                            alt="Post attachment"
                            className="w-32 h-32 object-cover rounded-xl shadow-sm"
                          />
                          <button
                            onClick={() => setEditImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* New Image Upload */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        {post.image ? 'Replace Image:' : 'Add Image:'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditImage(reader.result);
                          }
                        }}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                      />
                      {editImage && (
                        <div className="relative inline-block">
                          <img
                            src={editImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl shadow-sm"
                          />
                          <button
                            onClick={() => setEditImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remove preview"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        disabled={!editContent.trim() && !editImage}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setEditContent("");
                          setEditImage(null);
                        }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Post Text */}
                    <div className="bg-white/50 p-4 rounded-xl border border-slate-200">
                      <p className="text-slate-700 text-base leading-relaxed">
                        {post.content || "No content available"}
                      </p>
                    </div>
                    
                    {/* Post Image */}
                    {post.image && (
                      <div className="relative">
                        <img
                          src={post.image}
                          alt="Post attachment"
                          className="w-full h-auto max-h-48 object-cover rounded-xl shadow-sm"
                        />
                      </div>
                    )}
                    
                    {/* Post File Attachment */}
                    {post.file && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-slate-700 font-medium">File Attachment</span>
                      </div>
                    )}
                    
                    {/* Repost Display */}
                    {post.repost && (
                      <div className="bg-white/70 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-xs text-primary font-medium">Repost</span>
                        </div>
                        <p className="text-sm text-slate-600">{post.repost}</p>
                      </div>
                    )}
                    
                    {/* Post Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Posts Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {isOwner 
                ? "Share your thoughts, achievements, or updates with the community to start building your presence"
                : "This freelancer hasn't shared any posts yet"
              }
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Delete Post?</h3>
              <p className="text-slate-600 mb-8">
                This action cannot be undone. The post will be permanently removed.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeletingPost(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deletingPost)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

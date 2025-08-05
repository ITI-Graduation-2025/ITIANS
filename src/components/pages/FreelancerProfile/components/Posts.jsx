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
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null });
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

  const handleDeletePost = async () => {
    if (!deleteModal.postId) return;

    try {
      await deletePost(deleteModal.postId);
      setDeleteModal({ show: false, postId: null });
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const showDeleteModal = (postId) => {
    setDeleteModal({ show: true, postId });
  };

  const hideDeleteModal = () => {
    setDeleteModal({ show: false, postId: null });
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
    <div className="bg-white rounded-lg shadow-sm p-4 mt-8">
      <h2 className="text-lg font-bold text-[#B71C1C] mb-4">Posts</h2>
      {userPosts.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => {
            const isOwner = isPostOwner(post);
            const isEditing = editingPost === post.id;

            return (
              <div key={post.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B71C1C] resize-none bg-white"
                          rows={3}
                          placeholder="Edit your post..."
                        />
                        
                        {/* Edit Image Section */}
                        <div>
                          {editImage && (
                            <div className="relative inline-block mb-2">
                              <img
                                src={editImage}
                                alt="Post image"
                                className="max-h-32 rounded-lg border"
                              />
                              <button
                                onClick={removeEditImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                title="Remove image"
                              >
                                <HiOutlineXMark className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <input
                              ref={editImageRef}
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                            <button
                              type="button"
                              onClick={() => editImageRef.current?.click()}
                              disabled={uploadingImage}
                              className="flex items-center gap-1 text-xs text-[#B71C1C] hover:text-[#B71C1C]/80"
                            >
                              <HiOutlinePhoto className="w-3 h-3" />
                              {editImage ? "Change Image" : "Add Image"}
                            </button>
                            {uploadingImage && (
                              <span className="text-xs text-gray-500">Uploading...</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-[#B71C1C] text-white rounded text-xs hover:bg-[#B71C1C]/90"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="font-semibold text-black">{post.content}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-400">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleString()
                        : ""}
                    </span>
                    {isOwner && !isEditing && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-gray-400 hover:text-[#B71C1C] p-1 rounded"
                          title="Edit post"
                        >
                          <HiOutlinePencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => showDeleteModal(post.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title="Delete post"
                        >
                          <HiOutlineTrash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isEditing && (
                  <>
                    {post.attachment &&
                      post.attachment.type &&
                      post.attachment.type.startsWith("image") && (
                        <div className="relative inline-block mt-2">
                          <img
                            src={post.attachment.url}
                            alt="Attachment"
                            className="max-h-48 rounded"
                          />
                          <button
                            onClick={() => downloadFile(post.attachment.url, getFileName(post, post.attachment))}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            title="Download image"
                          >
                            <HiOutlineArrowDownTray className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    {post.attachment &&
                      post.attachment.type &&
                      !post.attachment.type.startsWith("image") && (
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={post.attachment.url}
                            download={post.attachment.name}
                            className="inline-flex items-center text-blue-600 underline"
                          >
                            {post.attachment.name}
                          </a>
                          <button
                            onClick={() => downloadFile(post.attachment.url, post.attachment.name)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="Download file"
                          >
                            <HiOutlineArrowDownTray className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    {post.repostOf && (
                      <div className="mt-2 text-xs text-gray-500">
                        Repost of: {post.repostOf.author} - {post.repostOf.content}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200">
            <button
              onClick={hideDeleteModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <HiOutlineTrash className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Post
              </h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={hideDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

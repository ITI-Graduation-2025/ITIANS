import { createPost } from "@/services/firebase";
import { upload } from "@/utils/upload";
import Image from "next/image";
import { useState } from "react";
import { HiOutlinePaperClip } from "react-icons/hi2";
export default function PostCreation({ currentUser }) {
  const [postContent, setPostContent] = useState("");
  const [postAttachment, setPostAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddPost = async (e) => {
    e.preventDefault();
    setError(null);
    const userId = currentUser?.uid || currentUser?.id;
    if (!postContent.trim() && !postAttachment) return;
    if (!currentUser || !userId) {
      setError("You must be logged in to create a post.");
      return;
    }
    let attachmentData = null;
    try {
      setUploading(true);
      if (postAttachment) {
        const url = await upload(postAttachment);
        const file = postAttachment.target.files[0];
        attachmentData = {
          name: file.name,
          type: file.type,
          url,
        };
      }
      const newPostData = {
        authorProfileImage: currentUser.profileImage,
        author: currentUser.name || "Unknown",
        role: currentUser.role || "Unknown",
        content: postContent,
        likes: 0,
        comments: [],
        isLiked: false,
        attachment: attachmentData,
        authorId: userId,
      };
      console.log(newPostData);
      
      await createPost(newPostData);
      setPostContent("");
      setPostAttachment(null);
    } catch (err) {
      setError("Error creating post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-primary text-primary-foreground">
        <h2 className="text-lg font-bold">Create a Post</h2>
      </div>
      <div className="p-4">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleAddPost}>
          <div className="flex items-start space-x-3">
            {currentUser.profileImage ? (
              <Image
                src={currentUser?.profileImage}
                className="h-12 w-12 rounded-full object-cover"
                width={100}
                height={100}
                alt={currentUser.fullName}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {currentUser?.profileImage}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts, projects, or questions..."
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
                rows={3}
                disabled={uploading}
              />
              {postAttachment && (
                <div className="mt-2 p-3 bg-muted rounded-lg border border-border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {postAttachment.type.startsWith("image") ? (
                      <img
                        src={URL.createObjectURL(postAttachment)}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <HiOutlinePaperClip className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium truncate max-w-xs">
                        {postAttachment.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {postAttachment.type}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => setPostAttachment(null)}
                    disabled={uploading}
                  ></button>
                </div>
              )}
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <label className="cursor-pointer flex items-center space-x-2">
                    <HiOutlinePaperClip className="w-5 h-5 text-primary" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setPostAttachment(e)}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                  disabled={
                    uploading || (!postContent.trim() && !postAttachment)
                  }
                >
                  {uploading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

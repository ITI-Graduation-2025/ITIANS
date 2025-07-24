export const Posts = ({ userPosts = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-8">
      <h2 className="text-lg font-bold text-[#B71C1C] mb-4">Posts</h2>
      {userPosts.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-black">{post.content}</span>
                <span className="text-xs text-gray-400">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
              {post.attachment &&
                post.attachment.type &&
                post.attachment.type.startsWith("image") && (
                  <img
                    src={post.attachment.url}
                    alt="Attachment"
                    className="max-h-48 rounded mt-2"
                  />
                )}
              {post.attachment &&
                post.attachment.type &&
                !post.attachment.type.startsWith("image") && (
                  <a
                    href={post.attachment.url}
                    download={post.attachment.name}
                    className="inline-flex items-center text-blue-600 underline mt-2"
                  >
                    {post.attachment.name}
                  </a>
                )}
              {post.repostOf && (
                <div className="mt-2 text-xs text-gray-500">
                  Repost of: {post.repostOf.author} - {post.repostOf.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

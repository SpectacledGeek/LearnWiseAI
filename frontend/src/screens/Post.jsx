import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ForumPost() {
  const location = useLocation();
  const postId = location.pathname.split("/").pop();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/community-posts/${postId}`);
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        showToast("Failed to fetch post", "error");
      }
    };

    fetchPost();
  }, [postId]);

  const showToast = (message, type = "error") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/community-posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      const data = await response.json();
      setPost(data.data);
      setComment("");
      showToast("Comment added successfully", "success");
    } catch (error) {
      showToast("Failed to add comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Main Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {post.user_id.avatar ? (
                <img
                  src={post.user_id.avatar}
                  alt={post.user_id.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-lg">
                  {post.user_id.name[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{post.user_id.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">{post.content}</p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
          rows="3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCommentSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </span>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {post.comments.map((comment) => (
          <div
            key={comment.comment_id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex space-x-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {comment.user_id.avatar ? (
                  <img
                    src={comment.user_id.avatar}
                    alt={comment.user_id.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                    {comment.user_id.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">
                    {comment.user_id.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

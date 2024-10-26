import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const navigate = useNavigate();

  // Add this near the top of your component, with the other state declarations
  const [currentUser, setCurrentUser] = useState({ name: "", avatar: null });

  // Add this useEffect right after your posts useEffect
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/current" // Adjust this endpoint to match your API
        );
        const data = await response.json();
        setCurrentUser({
          name: data.name,
          avatar: data.avatar,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/community-posts"
        );
        const data = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const showToast = (message, type = "error") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    setIsSubmitting(true);

    // Create a new comment object
    const newComment = {
      _id: Date.now(), // Use timestamp as temporary ID
      content: commentText,
      createdAt: new Date().toISOString(),
      user_id: {
        name: currentUser.name, // Use current user's name
        avatar: currentUser.avatar,
      },
    };

    // Update posts state with new comment
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
          };
        }
        return post;
      })
    );

    // Reset form state
    setCommentText("");
    setActiveCommentId(null);
    setIsSubmitting(false);
    showToast("Comment posted successfully", "success");
  };

  const handleLikePost = async (postId) => {
    try {
      const isCurrentlyLiked = likedPosts.has(postId);
      const newLikedPosts = new Set(likedPosts);

      if (isCurrentlyLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }

      setLikedPosts(newLikedPosts);

      // Update the posts state with the new like count
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isCurrentlyLiked
                  ? (post.likes || 1) - 1 // Decrease by 1 when unliking
                  : (post.likes || 0) + 1, // Increase by 1 when liking
              }
            : post
        )
      );

      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ liked: !isCurrentlyLiked }),
        }
      );

      if (!response.ok) throw new Error("Failed to update like status");

      showToast(isCurrentlyLiked ? "Post unliked!" : "Post liked!", "success");
    } catch (error) {
      console.error("Failed to update like status:", error);

      // Revert the optimistic update
      const revertedLikedPosts = new Set(likedPosts);
      if (likedPosts.has(postId)) {
        revertedLikedPosts.delete(postId);
      } else {
        revertedLikedPosts.add(postId);
      }
      setLikedPosts(revertedLikedPosts);

      setPosts(
        posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: likedPosts.has(postId)
                  ? (post.likes || 0) - 1 // Revert the like
                  : (post.likes || 0) + 1, // Revert the unlike
              }
            : post
        )
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Community Forum</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {post.user_id.avatar ? (
                      <img
                        src={post.user_id.avatar}
                        alt={post.user_id.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                        {post.user_id.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {post.user_id.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h2
                  onClick={() => navigate(`/forum/post/${post._id}`)}
                  className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                >
                  {post.title}
                </h2>

                <div className="text-gray-600 leading-relaxed mb-4">
                  {post.content.length > 200 ? (
                    <>
                      {post.content.slice(0, 200)}...
                      <button
                        onClick={() => navigate(`/forum/post/${post._id}`)}
                        className="text-blue-600 hover:text-blue-700 ml-2"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    post.content
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={() =>
                        setActiveCommentId(
                          activeCommentId === post._id ? null : post._id
                        )
                      }
                      className="flex items-center hover:text-blue-600"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {post.comments?.length || 0} Comments
                    </button>
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className={`flex items-center ${
                        likedPosts.has(post._id)
                          ? "text-blue-600"
                          : "hover:text-blue-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill={
                          likedPosts.has(post._id) ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {post.likes || 0} Likes
                    </button>
                  </div>

                  <button
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={() => navigate(`/forum/post/${post._id}`)}
                  >
                    View Discussion
                  </button>
                </div>

                {/* Display Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Comments
                    </h4>
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            {comment.user_id.avatar ? (
                              <img
                                src={comment.user_id.avatar}
                                alt={comment.user_id.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm">
                                {comment.user_id.name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="bg-gray-50 rounded-lg px-4 py-2">
                              <div className="font-medium text-sm text-gray-900">
                                {comment.user_id.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {comment.content}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCommentId === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setActiveCommentId(null);
                          setCommentText("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        disabled={isSubmitting || !commentText.trim()}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                          isSubmitting || !commentText.trim()
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPage;

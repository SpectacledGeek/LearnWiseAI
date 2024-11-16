import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SlideTabsExample from "../components/navbar";
import io from "socket.io-client";

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({ name: "", avatar: null });

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { withCredentials: true });
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on("newPost", (post) => {
      setPosts(prevPosts => [post, ...prevPosts]);
    });

    newSocket.on("likeUpdate", ({ postId, likes }) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, likes } : post
        )
      );
    });

    newSocket.on("newComment", ({ postId, comment }) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    });

    return () => newSocket.disconnect();
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/current", 
          {
            credentials: 'include' // Important for sending cookies
          }
        );
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setCurrentUser({
          name: data.data.name,
          avatar: data.data.avatar,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/posts",
          {
            credentials: 'include'
          }
        );
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.data.posts);
        
        // Initialize liked posts
        const initialLikedPosts = new Set();
        data.data.posts.forEach(post => {
          if (post.likes.includes(currentUser._id)) {
            initialLikedPosts.add(post._id);
          }
        });
        setLikedPosts(initialLikedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        showToast("Failed to load posts", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser._id]);

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (!response.ok) throw new Error('Failed to post comment');

      const commentData = await response.json();
      setCommentText("");
      setActiveCommentId(null);
      showToast("Comment posted successfully", "success");
    } catch (error) {
      console.error("Failed to post comment:", error);
      showToast("Failed to post comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to update like status');
      
      const isCurrentlyLiked = likedPosts.has(postId);
      const newLikedPosts = new Set(likedPosts);

      if (isCurrentlyLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }

      setLikedPosts(newLikedPosts);
      showToast(isCurrentlyLiked ? "Post unliked!" : "Post liked!", "success");
    } catch (error) {
      console.error("Failed to update like status:", error);
      showToast("Failed to update like status", "error");
    }
  };

  const showToast = (message, type = "error") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const renderComments = (comments) => {
    if (comments.length === 0) {
      return <p className="text-gray-500">No comments yet</p>;
    }

    return (
      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment._id} className="flex items-start space-x-2">
            <img 
              src={comment.user.avatar || "/default-avatar.png"} 
              alt="User avatar" 
              className="w-8 h-8 rounded-full" 
            />
            <div>
              <p className="font-semibold">{comment.user.name}</p>
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Rest of your existing JSX remains the same
  return (
    <>
      <SlideTabsExample />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div>Loading posts...</div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="mb-6 p-4 border rounded-lg shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p>{post.content}</p>

              {/* Like Button */}
              <button 
                onClick={() => handleLikePost(post._id)} 
                className="mt-2 px-4 py-2 text-white bg-blue-500 rounded">
                {likedPosts.has(post._id) ? "Unlike" : "Like"} ({post.likes.length})
              </button>

              {/* Comments Section */}
              <div className="mt-4">
                <h4 className="font-semibold">Comments</h4>
                {renderComments(post.comments)}

                {/* Add Comment */}
                {activeCommentId === post._id ? (
                  <div className="mt-2 flex items-center space-x-2">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows="3"
                      className="border p-2 w-full rounded"
                    />
                    <button 
                      onClick={() => handleCommentSubmit(post._id)} 
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-500 text-white rounded">
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveCommentId(post._id)} 
                    className="mt-2 text-blue-500">
                    Add a comment
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ForumPage;

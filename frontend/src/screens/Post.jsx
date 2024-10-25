import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Share2, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ForumPost() {
  // Get the post data passed via location state
  const location = useLocation();
  const postData = location.state?.post; // Expecting a single post object

  // Check if postData is valid
  if (!postData) {
    return <div className="container p-4">Post not found!</div>;
  }

  // Use state to manage the post data and comments
  const [post, setPost] = useState(postData);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    // Note: The likes functionality is not in the current post data; add if needed
  };

  const handleShare = () => {
    alert("Sharing functionality would be implemented here!");
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObj = {
        comment_id: Date.now().toString(), // Unique ID based on timestamp
        user_id: post.user_id._id, // Replace with actual user ID if needed
        content: newComment,
        _id: Date.now().toString(), // You may want a better ID strategy
      };
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, newCommentObj],
      }));
      setNewComment(''); // Clear the comment input
    }
  };

  return (
    <div className="container p-4 max-w-6xl">
      {/* Post Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.image} alt={post.user_id.first_name} />
              <AvatarFallback>{post.user_id.first_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.user_id.first_name} {post.user_id.last_name}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground mb-4">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t p-4">
          {/* The likes button has been commented out since there's no likes field in the data */}
          {/* <Button variant="ghost" size="sm" onClick={handleLike}>
            <ThumbsUp className="h-5 w-5 mr-2" />
            {post.likes || 0} Likes
          </Button> */}
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="flex space-x-2 mb-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow bg-white"
          />
          <Button onClick={handleAddComment}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Post comment</span>
          </Button>
        </div>
        {/* Render Comments */}
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <Card key={comment._id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.image} alt={comment.user_id} />
                    <AvatarFallback>{comment.user_id[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{comment.user_id}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

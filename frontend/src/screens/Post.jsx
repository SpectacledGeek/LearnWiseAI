import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Share2, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from "@/utils/axios";
import { toast } from "sonner";

export default function ForumPost() {
  const location = useLocation();
  const postId = location.pathname.split('/').pop();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/community-posts/${postId}`);
        setPost(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch post");
      }
    };

    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async () => {
    try {
      const response = await api.post(`/api/community-posts/${postId}/comments`, { content: comment });
      setPost(response.data.data);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Card>
        <CardContent>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Avatar>
            <AvatarImage src={post.user_id.avatar} alt={post.user_id.name} />
            <AvatarFallback>{post.user_id.name[0]}</AvatarFallback>
          </Avatar>
        </CardContent>
        <CardFooter>
          <Button>Like</Button>
          <Button>Share</Button>
        </CardFooter>
      </Card>
      <div>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
        <Button onClick={handleCommentSubmit}>Post comment</Button>
      </div>
      <div>
        {post.comments.map((comment) => (
          <Card key={comment.comment_id}>
            <CardContent>
              <Avatar>
                <AvatarImage src={comment.user_id.avatar} alt={comment.user_id.name} />
                <AvatarFallback>{comment.user_id.name[0]}</AvatarFallback>
              </Avatar>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

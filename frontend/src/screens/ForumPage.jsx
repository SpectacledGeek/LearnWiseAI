import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";
import { toast } from "sonner";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/community-posts');
        setPosts(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Card key={post._id}>
          <CardContent>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <Avatar>
              <AvatarImage src={post.user_id.avatar} alt={post.user_id.name} />
              <AvatarFallback>{post.user_id.name[0]}</AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter>
            <Button>Comment</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
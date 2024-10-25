import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios";
import { toast } from "sonner";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostTags, setNewPostTags] = useState(""); // New state for tags
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        console.log(response.data.data);
        setPosts(response.data.data.reverse());
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []); // Added an empty dependency array to avoid infinite loop

  const handleAddPost = async () => {
    if (
      newPostTitle.trim() !== "" &&
      newPostDescription.trim() !== "" &&
      newPostTags.trim() !== "" // Check if tags are provided
    ) {
      const newPost = {
        _id: Date.now().toString(), // Use a unique ID for the new post
        title: newPostTitle,
        content: newPostDescription,
        tags: newPostTags.split(",").map((tag) => tag.trim()), // Convert tags to an array
        user_id: {
          first_name: "Current",
          last_name: "User",
        },
        comments: [],
        createdAt: new Date().toISOString(),
      };

      const response = await api.post("/posts", newPost);
      toast.success("Post created successfully!");

      setPosts([newPost, ...posts]);
      setNewPostTitle("");
      setNewPostDescription("");
      setNewPostTags(""); // Clear the tags input
      setIsModalOpen(false);
    }
  };

  const handleVote = (id, isUpvote) => {
    setPosts(
      posts.map((post) =>
        post._id === id
          ? { ...post, votes: isUpvote ? post.votes + 1 : post.votes - 1 }
          : post
      )
    );
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleClick = (post) => {
    console.log("clicked");
    console.log(post);
    navigate("/forum-post", { state: { post } });
  };

  return (
    <div className="container p-4 max-w-4xl">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
        <DialogTrigger asChild>
          <Button className="mb-6 hover:bg-[#0a5399]">Create New Post</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              className="bg-white"
              type="text"
              placeholder="Post title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <Textarea
              className="bg-white"
              placeholder="Post description"
              value={newPostDescription}
              onChange={(e) => setNewPostDescription(e.target.value)}
            />
            <Input
              className="bg-white"
              type="text"
              placeholder="Tags (comma-separated)"
              value={newPostTags}
              onChange={(e) => setNewPostTags(e.target.value)}
            />
            <Button className="hover:bg-[#0a5399]" onClick={handleAddPost}>Submit Post</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post._id} className='cursor-pointer overflow-hidden' onClick={() => handleClick(post)}>
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={post.user_id.avatar || "/placeholder.svg"} alt={post.user_id.first_name} />
                  <AvatarFallback className="bg-[hsl(210,100%,96%)]">{post.user_id.first_name[0]}</AvatarFallback>
                </Avatar>
                <span>Posted by u/{post.user_id.first_name + " " + post.user_id.last_name}</span>
                <span className="mx-1">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.content}</p>
              <div className="text-sm text-muted-foreground">
                {post.tags.map((tag, index) => (
                  <span key={index} className="mr-2 px-3 py-1 font-semibold bg-[hsl(210,100%,96%)] rounded-full text-black">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="px-4 py-2 bg-[#0D1A42] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post._id, true)}
                >
                  <ArrowUp className="h-4 w-4 mr-1" />
                </Button>
                <span className="font-bold">{Math.floor(Math.random() * 1000) + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post._id, false)}
                >
                  <ArrowDown className="h-4 w-4 mr-1" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post._id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments.length} Comments
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))} 
      </div>
    </div>
  );
}

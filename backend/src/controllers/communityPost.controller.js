import asyncHandler from 'express-async-handler';
import { CommunityPost } from '../models/communityPost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { user_id, title, content, tags } = req.body;
  const image = req.file ? req.file.path : null;

  const newPost = new CommunityPost({
    user_id,
    title,
    content,
    tags,
    image,
  });

  await newPost.save();
  return res.status(201).json(new ApiResponse(201, newPost, "Post created successfully!"));
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find().populate('user_id', 'name avatar');
  return res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully!"));
});

// Get post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id).populate('user_id', 'name avatar');
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res.status(200).json(new ApiResponse(200, post, "Post retrieved successfully!"));
});

// Update post by ID
export const updatePost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags || post.tags;
  if (req.file) {
    post.image = req.file.path;
  }

  await post.save();
  return res.status(200).json(new ApiResponse(200, post, "Post updated successfully!"));
});

// Delete post by ID
export const deletePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await post.remove();
  return res.status(200).json(new ApiResponse(200, post, "Post deleted successfully!"));
});

// Add a comment to a post
export const addComment = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const { user_id, content } = req.body;
  const newComment = {
    comment_id: new mongoose.Types.ObjectId().toString(),
    user_id,
    content,
  };

  post.comments.push(newComment);
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Comment added successfully!"));
});

// Delete a comment from a post
export const deleteComment = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment.comment_id === req.params.commentId
  );
  if (commentIndex === -1) {
    throw new ApiError(404, "Comment not found");
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Comment deleted successfully!"));
});
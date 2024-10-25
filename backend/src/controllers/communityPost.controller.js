import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { CommunityPost } from "../models/communityPost.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from 'mongoose';


// Create a new post
export const createPost = asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;

    let imageLocalPath;
    let image;
    if (req.file) {
        imageLocalPath = req.file.path;
        console.log('image local path:', imageLocalPath); // Debugging line
        image = await uploadOnCloudinary(imageLocalPath);
    }

    // if (!imageLocalPath) {
    //     throw new Error('No file path provided for upload.');
    // }

    

    const post = await CommunityPost.create({
        user_id: req.user._id, // assuming user ID is obtained from the authenticated request
        title,
        content,
        tags,
        image: image?.url || "",
    });

    return res.status(201).json(new ApiResponse(200, post, "Post created successfully!"));
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await CommunityPost.find().populate('user_id', 'first_name last_name');

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully!"));
});

// Get a post by ID
export const getPostById = asyncHandler(async (req, res) => {
    const post = await CommunityPost.findById(req.params.id).populate('user_id', 'first_name last_name');

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(new ApiResponse(200, post, "Post fetched successfully!"));
});

// Update a post
export const updatePost = asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { title, content, tags }, { new: true });

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(new ApiResponse(200, post, "Post updated successfully!"));
});

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
    const post = await CommunityPost.findByIdAndDelete(req.params.id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully!"));
});

// Add a comment to a post
// Add a comment to a post
export const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body; // Get content from the request body

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Create a new comment object
    const newComment = {
        comment_id: new mongoose.Types.ObjectId(), // Corrected to use 'new'
        user_id: req.user._id, // assuming user ID is obtained from the authenticated request
        content, // Set content from the request body
    };

    post.comments.push(newComment); // Push the new comment to the comments array
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
        (comment) => comment._id.toString() === req.params.commentId
    );
    if (commentIndex === -1) {
        throw new ApiError(404, "Comment not found");
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.status(200).json(new ApiResponse(200, post, "Comment deleted successfully!"));
});
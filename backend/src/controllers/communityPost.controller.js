import asyncHandler from 'express-async-handler';
import { Post } from '../models/post.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost=asyncHandler(async(req,res)=>{
  const {content,link}=req.body;

  if(!content){
    throw new ApiError(400,"Content is required");
  }

  const post=await Post.create({
    author:req.user._id,
    content,link
  });


  const populatePost=await Post.findById(post._id)
  .populate("author","name avatar")
  .select("-__v");


  req.app.get("io").emit("newPost",populatePost);

  res.status(201).json(new ApiResponse(201,populatePost,"Post created successfully"));

});

export const getPosts=asyncHandler(async(req,res)=>{
  const page=parseInt(req.query.page) || 1;
  const limit=parseInt(req.query.limit) || 10;

  const posts=await Post.find()
  .populate("author","name avatar")
  .populate("comments.author","name avatar")
  .sort({createdAt:-1})
  .skip((page-1)*limit)
  .limit(limit);
  posts.forEach(post => {
    if (!post.comments || post.comments.length === 0) {
      post.comments = [{ content: 'No comments yet' }];
    }
  });

  const total=await Post.countDocuments();

  res.status(200).json(
    new ApiResponse(200,{
      posts,
      currentPage:page,
      totalPages:Math.ceil(total/limit)},"Post fetched successfully")
    )
  
})


export const likePost=asyncHandler(async(req,res)=>{
  const {postId}=req.params;

  const post=await Post.findById(postId);
  if(!post) throw new ApiError(404,"Post not found");

  const likeIndex=post.likes.indexOf(req.user._id);

  if(likeIndex===-1){
    post.like.push(req.user._id)
  }else{
    post.likes.splice(likeIndex,1);
  }

  await post.save()


  req.app.get("io").emit("likeUpdate",{
    postId,
    likes:post.likes,
    userId:req.user._id
  });
  
  res.status(200).json(
    new ApiResponse(200,{likes:post.likes},"Post like updated successfully")
    
  )
});


export const addComment=asyncHandler(async(req,res)=>{
  const { postId }=req.params;
  const {content}=req.body;

  if(!content) throw new ApiError(400,"Comment content is required")

  const post=await Post.findById(postId);
  if(!post) throw new ApiError(404,"Post not found")
  
    const comment={
      author:req.user._id,
      content
    }


    post.comments.push(comment);
    await post.save();

    const populatedPost=await Post.findById(postId)
    .populate("comments.author","name avatar");

    req.app.get("io").emit("newcomment",{
      postId,
      comment:populatedPost.comments[populatedPost.comments.length-1]
    })

    res.status(201).json(
      new ApiResponse(201,populatedPost,"Comment added successfully")
    )
})

import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
} from '../controllers/communityPost.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from '../middlewares/auth.middleware.js';

const communityPostRouter = Router();

// Community Post Routes
communityPostRouter.post('/', verifyJWT, upload.single('image'), createPost); // Create a new post
communityPostRouter.get('/', getAllPosts); // Get all posts
communityPostRouter.get('/:id', getPostById); // Get post by ID
communityPostRouter.put('/:id',verifyJWT, updatePost); // Update post by ID
communityPostRouter.delete('/:id',verifyJWT, deletePost); // Delete post by ID
communityPostRouter.post('/:id/comments',verifyJWT, addComment); // Add comment to post
communityPostRouter.delete('/:id/comments/:commentId',verifyJWT, deleteComment); // Delete comment

export default communityPostRouter;

import { Router } from "express";
import {
    createPost,
    getPosts,
    likePost,
    addComment
} from "../../src/controllers/communityPost.controller.js"

import verifyJWT from "../middleware/auth.middleware.js"


const router=Router()

router.use(verifyJWT)

router.post("/",createPost);
router.get("/",getPosts);
router.post("/:postId/like",likePost);
router.post("/:postId/comment",addComment);

export default router;
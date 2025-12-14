const express = require("express");
const protect = require("../middlewares/authMiddleware");

const {
  createPost,
  likePost,
  unlikePost,
  getFeed,
  getPostById,
  addComment,
  getComments,
} = require("../controllers/postController");

const router = express.Router();

// FEED 
router.get("/feed", protect, getFeed);

// POSTS
router.post("/", protect, createPost);

// LIKES
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);

// GET single post
router.get("/:id", protect, getPostById);

router.post("/:id/comment", protect, addComment);  
router.get("/:id/comments", protect, getComments);   

module.exports = router;

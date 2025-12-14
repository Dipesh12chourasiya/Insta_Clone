const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  followUser,
  unfollowUser,
  getUserProfile,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/search", protect, searchUsers);

router.get("/:id", protect, getUserProfile);

router.post("/follow/:id", protect, followUser);

router.post("/unfollow/:id", protect, unfollowUser);


module.exports = router;

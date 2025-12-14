const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    const post = await Post.create({
      user: req.user._id,
      imageUrl,
      caption,
    });

    const populatedPost = await post.populate("user", "username email");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }

    res.json({ message: "Post liked", likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await post.save();

    res.json({ message: "Post unliked", likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get feed (posts from followed users)
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      user: { $in: user.following },
    })
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username email")
      .populate("comments.user", "username email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user: req.user._id, text };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("comments.user", "username email");

    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({ comment: addedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments.user", "username email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId, parent: null })
    .populate("user", "name profilePic")
    .populate({
      path: "replies",
      populate: { path: "user", select: "name profilePic" },
    })
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { blogId, content, parent } = req.body;

  const comment = await Comment.create({
    blog: blogId,
    user: req.user._id,
    content,
    parent: parent || null,
  });

  const blog = await Blog.findById(blogId);
  if (blog) {
    blog.comments.push(comment._id);
    await blog.save();
  }

  const populatedComment = await Comment.findById(comment._id).populate("user", "name profilePic");

  res.status(201).json(populatedComment);
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized");
    }

    comment.content = content || comment.content;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // Also delete replies if any
    await Comment.deleteMany({ parent: comment._id });
    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: "Comment removed" });
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

// @desc    Like a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.likes.includes(req.user._id)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }
    await comment.save();
    res.json(comment.likes);
  } else {
    res.status(404);
    throw new Error("Comment not found");
  }
});

export { getComments, addComment, updateComment, deleteComment, likeComment };
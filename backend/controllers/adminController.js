import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    const commentCount = await Comment.countDocuments();

    // Get latets 5 users
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    // Get latest 5 blogs
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5).populate("author", "name");

    res.json({
        userCount,
        blogCount,
        commentCount,
        latestUsers,
        latestBlogs
    });
});

export { getUsers, deleteUser, getStats };

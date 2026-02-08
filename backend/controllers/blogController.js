import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword,
        $options: "i",
      },
    }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const tag = req.query.tag ? { tags: req.query.tag } : {};

  const count = await Blog.countDocuments({ ...keyword, ...category, ...tag, isDeleted: false, isPublished: true });
  const blogs = await Blog.find({ ...keyword, ...category, ...tag, isDeleted: false, isPublished: true })
    .populate("author", "name profilePic")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, isDeleted: false }).populate("author", "name profilePic bio");

  if (blog) {
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, images, tags, category } = req.body;

  const blog = new Blog({
    title,
    content,
    images,
    tags,
    category,
    author: req.user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, images, tags, category, isPublished } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to update this blog");
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = images || blog.images;
    blog.tags = tags || blog.tags;
    blog.category = category || blog.category;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

// @desc    Delete a blog (Soft delete)
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to delete this blog");
    }

    blog.isDeleted = true;
    await blog.save();
    res.json({ message: "Blog removed" });
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

// @desc    Likw a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (blog.likes.includes(req.user._id)) {
      blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      blog.likes.push(req.user._id);
    }
    await blog.save();
    res.json(blog.likes);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

// @desc    Get current user's blogs
// @route   GET /api/blogs/myblogs
// @access  Private
const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
  res.json(blogs);
});

export { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, likeBlog, getMyBlogs };
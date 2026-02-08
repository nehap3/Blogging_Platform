import express from "express";
import {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    getMyBlogs,
} from "../controllers/blogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);
router.get("/myblogs", protect, getMyBlogs);
router
    .route("/:id")
    .get(getBlogById)
    .put(protect, updateBlog)
    .delete(protect, deleteBlog);
router.route("/:id/like").put(protect, likeBlog);

export default router;
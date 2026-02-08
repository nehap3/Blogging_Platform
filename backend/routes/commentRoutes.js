import express from "express";
import {
    addComment,
    getComments,
    updateComment,
    deleteComment,
    likeComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addComment);
router.route("/:blogId").get(getComments);
router
    .route("/:id")
    .put(protect, updateComment)
    .delete(protect, deleteComment);
router.route("/:id/like").put(protect, likeComment);

export default router;
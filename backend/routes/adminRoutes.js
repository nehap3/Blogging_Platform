import express from "express";
import { getUsers, deleteUser, getStats } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/stats", getStats);

export default router;

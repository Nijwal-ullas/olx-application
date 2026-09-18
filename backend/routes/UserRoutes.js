import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register",UserController.registerUser);
router.post("/login",UserController.loginUser);
router.get("/profile",authMiddleware,UserController.profile);

export default router;

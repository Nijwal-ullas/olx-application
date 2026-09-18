import ProductController from "../controllers/ProductController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/",authMiddleware,upload.array("images",5),ProductController.createProduct);
router.get("/",ProductController.getProducts);
router.get("/myProducts",authMiddleware,ProductController.getMyProducts);
router.get("/:id",ProductController.getProduct);
router.put("/:id",authMiddleware,upload.array("images",5),ProductController.updateProduct);
router.delete("/:id",authMiddleware,ProductController.deleteProduct);

export default router

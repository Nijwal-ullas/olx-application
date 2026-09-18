import express from "express";
import AIController from "../controllers/AIController.js";

const router = express.Router();

router.post("/generate-description", AIController.generateDescription);
router.post("/search", AIController.understandSearch);
router.post("/product-Assistant",AIController.productAssistant);
router.post("/mock-assistant",AIController.mockAssistance);
router.post("/chat",AIController.chatWithAI);
router.post("/product",AIController.productSell);
router.post("/rag",AIController.rag);



export default router;
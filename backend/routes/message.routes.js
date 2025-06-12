import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);  // more specific
router.get("/:id", protectRoute, getMessages);        // more general


export default router;

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";

import {
  createChat,
  getChats,
  getMessages,
  sendMessage,
  renameChat,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

// Create a new chat
router.post("/new", authenticate, createChat);

// Get all chats of logged-in user
router.get("/", authenticate, getChats);

// Get all messages of a specific chat
router.get("/:id", authenticate, getMessages);

// Send message to AI
router.post("/:id/message", authenticate, sendMessage);

// Rename a chat
router.patch("/:id", authenticate, renameChat);

// Delete a chat
router.delete("/:id", authenticate, deleteChat);

export default router;
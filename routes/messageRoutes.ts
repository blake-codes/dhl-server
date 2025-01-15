import express from "express";
import {
  getAllMessages,
  getMessageById,
  sendMessage,
} from "../controllers/messageController";

const router = express.Router();
router.post("/", sendMessage);
router.get("/:id", getMessageById);
router.get("/", getAllMessages);

export default router;

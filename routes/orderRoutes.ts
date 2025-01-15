import express from "express";
import {
  createOrder,
  updateOrder,
  getOrder,
  getAllOrders,
  addMovementHistory,
  deleteOrder,
  getOrdersByUsername,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.put("/:trackingNumber", updateOrder);
router.delete("/:trackingNumber", deleteOrder);
router.patch("/:trackingNumber/add-movement", addMovementHistory);
router.get("/:trackingNumber", getOrder);
router.get("/find/:username", getOrdersByUsername);

export default router;

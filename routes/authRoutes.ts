import express from "express";
import { login, healthCheck } from "../controllers/authController";

const router = express.Router();
router.post("/login", login);
router.post("/register", login);
router.get("/healthcheck", healthCheck);

export default router;

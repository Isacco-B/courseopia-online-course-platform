import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("",verifyToken, getAllUsers);

export default router;

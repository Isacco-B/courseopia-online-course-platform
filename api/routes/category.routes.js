import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { check } from "express-validator";

const router = express.Router();

router.get("", verifyToken, verifyAdmin, getCategories);
router.post(
  "",
  verifyToken,
  verifyAdmin,
  [check("title").notEmpty().isString().withMessage("Title must be a string")],
  createCategory
);
router.put(
  "/:categoryId",
  verifyToken,
  verifyAdmin,
  [
    check("title").notEmpty().isString().withMessage("Title must be a string"),
    check("categoryId").isMongoId().withMessage("Invalid ID"),
  ],
  updateCategory
);
router.delete(
  "/:categoryId",
  verifyToken,
  verifyAdmin,
  [check("categoryId").isMongoId().withMessage("Invalid ID")],
  deleteCategory
);

export default router;

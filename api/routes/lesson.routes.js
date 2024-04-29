import express from "express";
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { check } from "express-validator";

const router = express.Router();

router.get("", getLessons);
router.get(
  "/:slug",
  check("slug").notEmpty().withMessage("Slug is required"),
  getLesson
);
router.post(
  "",
  verifyToken,
  verifyAdmin,
  [
    check("title")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Title must be a string")
      .trim(),
    check("content")
      .notEmpty()
      .isString()
      .withMessage("Content must be a string")
      .trim(),
    check("duration")
      .notEmpty()
      .isNumeric()
      .escape()
      .withMessage("Duration is required")
      .trim(),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID")
      .trim(),
  ],
  createLesson
);
router.put(
  "/:lessonId",
  verifyToken,
  verifyAdmin,
  [
    check("lessonId").isMongoId().withMessage("Invalid ID"),
    check("title")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Title must be a string")
      .trim(),
    check("content")
      .notEmpty()
      .isString()
      .withMessage("Content must be a string")
      .trim(),
    check("duration")
      .notEmpty()
      .isNumeric()
      .escape()
      .withMessage("Duration is required")
      .trim(),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID")
      .trim(),
  ],
  updateLesson
);
router.delete(
  "/:lessonId",
  verifyToken,
  verifyAdmin,
  check("lessonId").isMongoId().withMessage("Invalid ID"),
  deleteLesson
);

export default router;

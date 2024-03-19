import express from "express";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

const router = express.Router();

router.get("", getLessons);
router.post("", createLesson);
router.put("/:lessonId", updateLesson);
router.delete("/:lessonId", deleteLesson);

export default router

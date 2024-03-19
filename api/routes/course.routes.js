import express from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/couse.controller.js";

const router = express.Router();

router.get("", getCourses);
router.post("", createCourse);
router.put("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);

export default router;

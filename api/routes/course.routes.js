import express from "express";
import multer from "multer";
import path from "path";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/couse.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { check } from "express-validator";

const router = express.Router();

const parseLessonsJSON = (req, res, next) => {
  if (req.body.lessons && typeof req.body.lessons === "string") {
    try {
      req.body.lessons = JSON.parse(req.body.lessons);
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            type: "json",
            value: req.body.lessons,
            msg: "Invalid JSON format for lessons field",
            path: "lessons",
            location: "body",
          },
        ],
      });
    }
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "assets/courses");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const MAX_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, callback) => {
    const filetypes = /jpeg|jpg|png/;
    const mimeType = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback({
      statusCode: 400,
      message:
        "File upload only supports the following filetypes - jpeg, jpg, png",
    });
  },
}).single("courses");

router.get("", getCourses);
router.get(
  "/:slug",
  check("slug").notEmpty().withMessage("Slug is required"),
  getCourse
);
router.post(
  "",
  verifyToken,
  verifyAdmin,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return next(errorHandler(400, err.message));
      } else if (err) {
        return next(err);
      }
      next();
    });
  },
  parseLessonsJSON,
  [
    check("title")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Title must be a string")
      .trim(),
    check("description")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Description must be a string")
      .trim(),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID"),
    check("teacher")
      .notEmpty()
      .withMessage("Teachers are required")
      .isMongoId()
      .withMessage("Invalid teacher ID"),
    check("lessons")
      .notEmpty()
      .toArray()
      .withMessage("Lessons are required")
      .isArray()
      .withMessage("Lessons must be an array")
      .isMongoId()
      .withMessage("Invalid lesson ID"),
    check("maxPoints")
      .notEmpty()
      .withMessage("Max points are required")
      .isNumeric()
      .withMessage("Max points must be a number"),
    check("projectDuration")
      .optional()
      .isNumeric()
      .withMessage("Project duration must be a number"),
    check("project")
      .notEmpty()
      .withMessage("Project is required")
      .isBoolean()
      .withMessage("Project is required"),
  ],
  createCourse
);
router.put(
  "/:courseId",
  verifyToken,
  verifyAdmin,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return next(errorHandler(400, err.message));
      } else if (err) {
        return next(err);
      }
      next();
    });
  },
  parseLessonsJSON,
  [
    check("courseId").isMongoId().withMessage("Invalid course ID"),
    check("title")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Title must be a string")
      .trim(),
    check("description")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Description must be a string")
      .trim(),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID"),
    check("teacher")
      .notEmpty()
      .withMessage("Teachers are required")
      .isMongoId()
      .withMessage("Invalid teacher ID"),
    check("lessons")
      .notEmpty()
      .toArray()
      .withMessage("Lessons are required")
      .isArray()
      .withMessage("Lessons must be an array")
      .isMongoId()
      .withMessage("Invalid lesson ID"),
    check("maxPoints")
      .notEmpty()
      .withMessage("Max points are required")
      .isNumeric()
      .withMessage("Max points must be a number"),
    check("projectDuration")
      .optional()
      .isNumeric()
      .withMessage("Project duration must be a number"),
    check("project")
      .notEmpty()
      .withMessage("Project is required")
      .isBoolean()
      .withMessage("Project is required"),
  ],
  updateCourse
);
router.delete(
  "/:courseId",
  verifyToken,
  verifyAdmin,
  check("courseId").isMongoId().withMessage("Invalid ID"),
  deleteCourse
);

export default router;

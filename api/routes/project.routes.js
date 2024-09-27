import express from "express";
import multer from "multer";
import path from "path";
import {
  getProjects,
  createProject,
  updateProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyIsOwner } from "../middleware/verifyIsOwner.js";
import { check } from "express-validator";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "assets/projects");
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
    const filetypes = /pdf/;
    const mimeType = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback({
      statusCode: 400,
      message: "File upload only supports the following filetypes - pdf",
    });
  },
}).single("projects");

router.get("", getProjects);
router.post(
  "/:userId",
  verifyToken,
  verifyIsOwner,
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
  [
    check("createdBy")
      .notEmpty()
      .withMessage("createdBy is required")
      .isMongoId()
      .withMessage("Invalid ID"),
    check("course")
      .notEmpty()
      .withMessage("course is required")
      .isMongoId()
      .withMessage("Invalid ID"),
  ],
  createProject
);
router.put(
  "/:projectId",
  [
    check("projectId")
      .notEmpty()
      .withMessage("projectId is required")
      .isMongoId()
      .withMessage("Invalid ID"),
    check("isCorrect")
      .notEmpty()
      .withMessage("isCorrect is required")
      .isBoolean()
      .withMessage("isCorrect must be a boolean"),
    check("isPassed")
      .notEmpty()
      .withMessage("isPassed is required")
      .isBoolean()
      .withMessage("isPassed must be a boolean"),
    check("description")
      .notEmpty()
      .withMessage("description is required")
      .isString()
      .withMessage("description must be a string"),
    check("correctedBy")
      .notEmpty()
      .withMessage("correctedBy is required")
      .isMongoId()
      .withMessage("Invalid ID"),
    check("projectPoints")
      .isNumeric()
      .withMessage("projectPoints must be a number"),
  ],
  updateProject
);

export default router;

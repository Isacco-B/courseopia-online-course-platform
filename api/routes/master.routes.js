import express from "express";
import {
  getMasters,
  getMaster,
  createMaster,
  updateMaster,
  deleteMaster,

} from "../controllers/master.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { check } from "express-validator";

const router = express.Router();

router.get("", getMasters);
router.get(
  "/:slug",
  check("slug").notEmpty().withMessage("Slug is required"),
  getMaster
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
    check("description")
      .notEmpty()
      .isString()
      .withMessage("description must be a string")
      .trim(),
    check("courses")
      .notEmpty()
      .withMessage("Courses are required")
      .isArray()
      .withMessage("Courses must be an array"),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID")
      .trim(),
  ],
  createMaster
);
router.put(
  "/:masterId",
  verifyToken,
  verifyAdmin,
  [
    check("masterId").isMongoId().withMessage("Invalid ID"),
    check("title")
      .notEmpty()
      .isString()
      .escape()
      .withMessage("Title must be a string")
      .trim(),
    check("description")
      .notEmpty()
      .isString()
      .withMessage("description must be a string")
      .trim(),
    check("courses")
      .notEmpty()
      .withMessage("Courses are required")
      .isArray()
      .withMessage("Courses must be an array"),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID")
      .trim(),
  ],
  updateMaster
);
router.delete(
  "/:masterId",
  verifyToken,
  verifyAdmin,
  check("masterId").isMongoId().withMessage("Invalid ID"),
  deleteMaster
);

export default router;

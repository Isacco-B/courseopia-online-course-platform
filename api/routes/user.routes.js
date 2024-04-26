import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeCompletedLessons,
  changeStatus,
  changeRole,
  setCurrentMaster,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { verifyIsOwner } from "../middleware/verifyIsOwner.js";
import { check } from "express-validator";

const router = express.Router();

router.get("", getUsers);
router.get(
  "/:slug",
  check("slug").notEmpty().withMessage("Slug is required"),
  getUser
);
router.put(
  "/:userId",
  verifyToken,
  verifyIsOwner,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("firstName")
      .optional()
      .isString()
      .escape()
      .withMessage("First name must be a string")
      .trim(),
    check("lastName")
      .optional()
      .isString()
      .escape()
      .withMessage("Last name must be a string")
      .trim(),
    check("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .escape()
      .withMessage("Email must be a valid email")
      .trim(),
    check("password")
      .optional()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters long")
      .trim(),
  ],
  updateUser
);
router.put(
  "/:userId/lessons/:lessonId",
  verifyToken,
  verifyIsOwner,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("lessonId").isMongoId().withMessage("Invalid ID"),
  ],
  changeCompletedLessons
);
router.put(
  "/:userId/master/:masterId",
  verifyToken,
  verifyIsOwner,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("masterId").isMongoId().withMessage("Invalid ID"),
  ],
  setCurrentMaster
);
router.put(
  "/:userId/status",
  verifyToken,
  verifyAdmin,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("active").isBoolean().withMessage("Active must be a boolean"),
    check("user").isMongoId().withMessage("Invalid ID"),
  ],
  changeStatus
);
router.put(
  "/:userId/role",
  verifyToken,
  verifyAdmin,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("role")
      .isIn(["student", "teacher", "admin"])
      .withMessage("Invalid role"),
    check("user").isMongoId().withMessage("Invalid ID"),
  ],
  changeRole
);
router.delete(
  "/:userId",
  verifyToken,
  verifyIsOwner,
  check("userId").isMongoId().withMessage("Invalid ID"),
  deleteUser
);

export default router;

import express from "express";
import {
  signIn,
  signUp,
  signOut,
  refresh,
  changePassword,
  createVerifyAccountToken,
  checkVerifyAccountToken,
} from "../controllers/auth.controller.js";
import {
  createPasswordReset,
  checkPasswordResetToken,
  confirmPasswordReset,
} from "../controllers/password-reset.controller.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import { check } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyIsOwner } from "../middleware/verifyIsOwner.js";

const router = express.Router();

router.post(
  "/sign-up",
  [
    check("firstName")
      .notEmpty()
      .escape()
      .withMessage("First name is required")
      .isString()
      .withMessage("First name must be a string")
      .trim(),
    check("lastName")
      .notEmpty()
      .escape()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Last name must be a string")
      .trim(),
    check("email")
      .notEmpty()
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .escape()
      .withMessage("Email is required")
      .trim(),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters long")
      .trim(),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Confirm password must be at least 8 characters long")
      .trim(),
  ],
  loginLimiter,
  signUp
);
router.post(
  "/sign-in",
  loginLimiter,
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email")
      .trim(),
    check("password").notEmpty().withMessage("Password is required").trim(),
  ],
  signIn
);
router.post("/sign-out", signOut);
router.get("/refresh", refresh);
router.post(
  "/reset-password",
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .trim(),
  createPasswordReset
);
router.get(
  "/reset-confirm/:token",
  check("token").notEmpty().withMessage("Token is required"),
  checkPasswordResetToken
);

router.post(
  "/confirm-password-reset",
  [
    check("token").notEmpty().withMessage("Token is required"),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters long")
      .trim(),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Confirm password must be at least 8 characters long")
      .trim(),
  ],
  confirmPasswordReset
);

router.post(
  "/change-password/:userId",
  check("userId").notEmpty().isMongoId().withMessage("Invalid userId"),
  verifyToken,
  verifyIsOwner,
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long")
    .trim(),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({
      min: 8,
    })
    .withMessage("Confirm password must be at least 8 characters long")
    .trim(),
  changePassword
);

router.get(
  "/verify-account/:userId",
  verifyToken,
  verifyIsOwner,
  check("userId").notEmpty().isMongoId().withMessage("Invalid userId"),
  createVerifyAccountToken
);
router.post(
  "/verify-account/:userId",
  verifyToken,
  verifyIsOwner,
  check("token").notEmpty().withMessage("Token is required"),
  checkVerifyAccountToken
);

export default router;

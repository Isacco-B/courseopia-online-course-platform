import express from "express";
import { signIn, signUp, signOut, refresh } from "../controllers/auth.controller.js";
import { check } from "express-validator";
import { loginLimiter } from "../middleware/loginLimiter.js";

const router = express.Router();

router.post(
  "/sign-up",
  [
    check("firstName").notEmpty().withMessage("First name is required").trim(),
    check("lastName").notEmpty().withMessage("Last name is required").trim(),
    check("email").isEmail().withMessage("Email is required").trim(),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 6,
      })
      .withMessage("Password must be at least 6 characters long")
      .trim(),
  ],
  loginLimiter,
  signUp
);
router.post("/sign-in", loginLimiter, signIn);
router.post("/sign-out" , signOut);
router.get("/refresh", refresh);

export default router;

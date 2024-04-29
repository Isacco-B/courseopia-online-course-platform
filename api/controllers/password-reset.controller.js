import User from "../models/user.model.js";
import PasswordReset from "../models/password-reset.model.js";
import bcrypjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import { sendResetPasswordEmail } from "../utils/emailTemplates/passwordResetEmail.js";
import { validationResult } from "express-validator";

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://demo7.isaccobertoli.com";

const CLIENT_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://demo7.isaccobertoli.com";

export const createPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.PASSWORD_TOKEN_SECRET,
      {
        expiresIn: "4m",
      }
    );

    await PasswordReset.updateOne(
      { user: user._id },
      { user: user._id, token: token },
      { upsert: true }
    );

    const resetLink = `${SERVER_URL}/api/auth/reset-confirm/${token}`;
    await sendResetPasswordEmail(email, resetLink);
    res.status(200).json({
      message: "Password reset link created successfully",
      resetLink: resetLink,
    });
  } catch (error) {
    next(error);
  }
};

export const checkPasswordResetToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { token } = req.params;
  try {
    const passwordReset = await PasswordReset.findOne({ token });
    if (!passwordReset) {
      return res.redirect(
        `${CLIENT_URL}/password-dimenticata?error=invalid_token`
      );
    }
    jwt.verify(token, process.env.PASSWORD_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect(
          `${CLIENT_URL}/password-dimenticata?error=invalid_token`
        );
      }
      res.redirect(`${CLIENT_URL}/password-reset/${token}`);
    });
  } catch (error) {
    res.redirect(
      `${CLIENT_URL}/password-dimenticata?error=generic_error`
    );
    next(error);
  }
};

export const confirmPasswordReset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { token, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(errorHandler(400, "Password do not match"));
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(
        400,
        "Your password must be between 8 and 24 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%)."
      )
    );
  }
  const hashedPassword = bcrypjs.hashSync(password, 10);
  try {
    const passwordReset = await PasswordReset.findOne({ token });
    if (!passwordReset) {
      return next(errorHandler(404, "Password reset token not found"));
    }
    const user = await User.findOne({ _id: passwordReset.user });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.password = hashedPassword;
    await user.save();
    await PasswordReset.deleteOne({ _id: passwordReset._id });
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

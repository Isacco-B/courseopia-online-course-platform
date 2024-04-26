import User from "../models/user.model.js";
import AccountVerification from "../models/account-verification.js";
import bcrypjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";
import { generateRandomNumber } from "../utils/randomNumber.js";
import { accountVerificationEmail } from "../utils/emailTemplates/accountVerificationEmail.js";

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password, confirmPassword } = req.body;

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
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = await bcrypjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Credentials"));
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: validUser._id,
          slug: validUser.slug,
          email: validUser.email,
          role: validUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: validUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(400).json("You are already logged out");
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

export const refresh = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return next(errorHandler(401, "Unathorized"));
  const refreshToken = cookies.jwt;
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return next(errorHandler(403, "Forbidden"));
        const user = await User.findOne({ _id: decoded.id });
        if (!user) return next(errorHandler(404, "User not found"));
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: user._id,
              slug: user.slug,
              email: user.email,
              role: user.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.user;
  const { password, confirmPassword } = req.body;
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
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createVerifyAccountToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id, email } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const OTP = generateRandomNumber(6);
    const hashedOTP = bcrypjs.hashSync(OTP, 10);
    await AccountVerification.updateOne(
      { user: user._id },
      { token: hashedOTP },
      { upsert: true }
    );
    await accountVerificationEmail(email, OTP);
    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    next(error);
  }
};

export const checkVerifyAccountToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { token } = req.body;
  const { id } = req.user;
  try {
    const accountVerification = await AccountVerification.findOne({
      user: id,
    });
    if (!accountVerification) {
      return next(errorHandler(404, "Account verification not found"));
    }
    const validToken = await bcrypjs.compare(token, accountVerification.token);
    if (!validToken) {
      return next(errorHandler(400, "Invalid token"));
    }
    const user = await User.findOne({ _id: accountVerification.user });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.verified = true;
    await user.save();
    await accountVerification.deleteOne({ _id: accountVerification._id });
    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    next(error);
  }
};

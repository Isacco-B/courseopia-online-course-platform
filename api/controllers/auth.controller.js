import User from "../models/user.model.js";
import bcrypjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorHandler(400, "Invalid Credentials"));
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
    return next(errorHandler(400, "Invalid Credentials"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Invalid Credentials"));
    }
    const validPassword = bcrypjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Credentials"));
    }

    const match = await bcrypjs.compare(password, validUser.password);
    if (!match) {
      return next(errorHandler(400, "Invalid Credentials"));
    }

    // Generate JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          firstName: validUser.firstName,
          email: validUser.email,
          role: validUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Change to 15m in production
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { email: validUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Change to 7d in production
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Accessible only by web server
      secure: true, // Required only when using HTTPS
      sameSite: "None", // Required only if site is using cookie on different domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // Change to 7d in production
    });

    // Send accessToken in response
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

export const refresh = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return next(errorHandler(401, "Unathorized"));
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return next(errorHandler(403, "Forbidden"));
      const user = await User.findOne({ email: decoded.email });
      const accessToken = jwt.sign(
        {
          UserInfo: {
            firstName: user.firstName,
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
};

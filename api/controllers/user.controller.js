import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate("profile")
      .populate("currentMaster")
      .exec();
    if (!users) {
      return next(errorHandler(404, "Users not found"));
    }
    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { slug } = req.params;
    const user = await User.findOne({ slug })
      .populate("profile")
      .populate("currentMaster")
      .exec();
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.userId;
  const updatedUserData = req.body;
  const allowedFields = ["firstName", "lastName", "email", "password"];
  const filteredUserData = {};

  for (const field of allowedFields) {
    if (updatedUserData[field] !== undefined) {
      if (field === "password") {
        const { password, confirmPassword } = updatedUserData;
        if (password !== confirmPassword) {
          return next(errorHandler(400, "Passwords do not match"));
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
      }
      if (field === "email") {
        const existingEmail = await User.findOne({
          email: updatedUserData[field],
          _id: { $ne: userId },
        });
        if (existingEmail) {
          return next(errorHandler(400, "Email already exists"));
        }
      }
      filteredUserData[field] = updatedUserData[field];
    }
  }
  if (Object.keys(filteredUserData).length === 0) {
    return next(errorHandler(400, "No data to update"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUserData },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }
    await Profile.findOneAndDelete({ user: deletedUser._id });
    const { password, ...rest } = deletedUser._doc;
    res
      .clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
      .status(200)
      .json({
        message: "User deleted successfully",
        deletedUser: rest,
      });
  } catch (error) {
    next(error);
  }
};

export const changeCompletedLessons = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;
    const user = await User.findById(userId);
    let updatedLessonsCompleted;

    if (user.lessonsCompleted.includes(lessonId)) {
      updatedLessonsCompleted = user.lessonsCompleted.filter(
        (id) => id.toString() !== lessonId
      );
    } else {
      updatedLessonsCompleted = [...user.lessonsCompleted, lessonId];
    }

    user.lessonsCompleted = updatedLessonsCompleted;
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.user,
      {
        $set: {
          active: req.body.active,
        },
      },
      { new: true, runValidators: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.user,
      {
        $set: {
          role: req.body.role,
        },
      },
      { new: true, runValidators: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const setCurrentMaster = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.params.userId;
    const masterId = req.params.masterId;
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.currentMaster = masterId;
    await user.save();
    const { password, ...rest } = user._doc;
    res.status(200).json({
      message: "User updated successfully",
      updatedUser: rest,
    });
  } catch (error) {
    next(error);
  }
};

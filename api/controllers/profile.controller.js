import Profile from "../models/profile.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find();
    if (!profiles) {
      return next(errorHandler(404, "Profiles not found"));
    }
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).populate("user").exec();
    if (!profile) {
      return next(errorHandler(404, "Profile not found"));
    }
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.params;
  const updatedProfileData = req.body;
  let excludedFields = [
    "_id",
    "updatedAt",
    "createdAt",
    "__v",
    "user",
  ];
  let allowedFields = Object.keys(Profile.schema.paths).filter(
    (field) => !excludedFields.includes(field)
  );

  const filteredProfileData = {};
  for (const field of allowedFields) {
    if (updatedProfileData[field] !== undefined) {
      filteredProfileData[field] = updatedProfileData[field];
    }
  }

  if (Object.keys(filteredProfileData).length === 0) {
    return next(errorHandler(400, "No fields to update"));
  }
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: filteredProfileData },
      { new: true }
    );
    if (!updatedProfile) {
      return next(errorHandler(404, "Profile not found"));
    }
    res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.file) {
    return next(errorHandler(400, "No file uploaded"));
  }
  const { userId } = req.params;
  const fullPath = `${req?.file?.fieldname}/${req?.file?.filename}`;

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { profilePicture: fullPath } },
      { new: true }
    );
    if (!updatedProfile) {
      return next(errorHandler(404, "Profile not found"));
    }
    res.status(200).json({
      message: "Profile image updated successfully",
      updatedProfile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

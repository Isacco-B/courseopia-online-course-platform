import Master from "../models/master.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getMasters = async (req, res, next) => {
  try {
    const masters = await Master.find().populate("courses").populate("category").exec();
    if (!masters) {
      return errorHandler(404, "Masters not found");
    }
    res.status(200).json(masters);
  } catch (error) {
    next(error);
  }
};

export const getMaster = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const slug = req.params.slug;
    const master = await Master.findOne({ slug: slug })
      .populate("courses")
      .populate("category")
      .exec();
    if (!master) {
      return errorHandler(404, "Master not found");
    }
    res.status(200).json(master);
  } catch (error) {
    next(error);
  }
};

export const createMaster = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, courses, category } = req.body;
    const unexpectedFields = Object.keys(req.body).filter(
      (field) =>
        !["title", "description", "courses", "category"].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }
    const newMaster = new Master({
      title: title,
      description: description,
      courses: courses,
      category: category,
    });
    const savedMaster = await newMaster.save();
    res.status(201).json({
      message: "Master created successfully",
      savedMaster: savedMaster,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaster = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, courses, category } = req.body;
    const unexpectedFields = Object.keys(req.body).filter(
      (field) =>
        !["title", "description", "courses", "category"].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }
    const masterId = req.params.masterId;
    const updatedMaster = await Master.findByIdAndUpdate(
      masterId,
      {
        $set: {
          title: title,
          description: description,
          courses: courses,
          category: category,
        },
      },
      { new: true }
    );
    if (!updatedMaster) {
      return errorHandler(404, "Master not found");
    }
    res.status(200).json({
      message: "Master updated successfully",
      updatedMaster: updatedMaster,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaster = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const masterId = req.params.masterId;
    const deletedMaster = await Master.findByIdAndDelete(masterId);
    if (!deletedMaster) {
      return errorHandler(404, "Master not found");
    }
    res.status(200).json({
      message: "Master deleted successfully",
      deletedMaster: deletedMaster,
    });
  } catch (error) {
    next(error);
  }
};

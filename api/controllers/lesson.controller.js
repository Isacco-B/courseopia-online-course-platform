import Lesson from "../models/lesson.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const newLesson = new Lesson({
      title: req.body.title,
      content: req.body.content,
      duration: req.body.duration,
      completed: req.body.completed,
    });
    const savedLesson = await newLesson.save();
    res.status(201).json({
      message: "Lesson created successfully",
      savedLesson: savedLesson,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const updatedProduct = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          duration: req.body.duration,
          completed: req.body.completed,
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      return next(errorHandler(404, "Lesson not found"));
    }
    res.status(200).json({
      message: "Lesson updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!deletedLesson) {
      return next(errorHandler(404, "Lesson not found"));
    }
    res.status(200).json({
      message: "Lesson deleted successfully",
      deletedLesson: deletedLesson,
    });
  } catch (error) {
    next(error);
  }
};

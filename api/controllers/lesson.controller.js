import Lesson from "../models/lesson.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().populate("category").exec();
    if (!lessons) {
      return next(errorHandler(404, "Lessons not found"));
    }
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const slug = req.params.slug;
    const lesson = await Lesson.findOne({ slug: slug }).populate("category").exec();
    if (!lesson) {
      return next(errorHandler(404, "Lesson not found"));
    }
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
}

export const createLesson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, content, duration, category } = req.body;
    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !["title", "content", "duration", "category"].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }

    const newLesson = new Lesson({
      title: title,
      content: content,
      duration: duration,
      category: category,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, content, duration, category } = req.body;
    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !["title", "content", "duration", "category"].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }
    const lessonId = req.params.lessonId;
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: {
          title: title,
          content: content,
          duration: duration,
          category: category,
        },
      },
      { new: true }
    );
    if (!updatedLesson) {
      return next(errorHandler(404, "Lesson not found"));
    }
    res.status(200).json({
      message: "Lesson updated successfully",
      updatedLesson: updatedLesson,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const lessonId = req.params.lessonId;
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
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

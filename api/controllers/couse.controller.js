import Course from "../models/course.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate("category")
      .populate({
        path: "teacher",
        select: ["firstName", "lastName", "slug", "profile"],
        populate: {
          path: "profile",
          model: "Profile",
          select: ["profilePicture"],
        },
      })
      .populate("lessons")
      .exec();
    if (!courses) {
      return next(errorHandler(404, "Courses not found"));
    }
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const slug = req.params.slug;
    const course = await Course.findOne({ slug: slug })
      .populate("category")
      .populate({
        path: "teacher",
        select: ["firstName", "lastName", "slug", "profile"],
        populate: {
          path: "profile",
          model: "Profile",
          select: ["profilePicture"],
        },
      })
      .populate("lessons")
      .exec();
    if (!course) {
      return next(errorHandler(404, "Course not found"));
    }
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      title,
      description,
      category,
      teacher,
      lessons,
      maxPoints,
      project,
      projectDuration,
    } = req.body;
    
    const unexpectedFields = Object.keys(req.body).filter(
      (field) =>
        ![
          "title",
          "description",
          "category",
          "teacher",
          "lessons",
          "courses",
          "maxPoints",
          "projectDuration",
          "project",
        ].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }
    const courseData = {
      title,
      description,
      category,
      teacher,
      lessons,
      maxPoints,
      project,
    };
    if (req.file) {
      const image = `${req?.file?.fieldname}/${req?.file?.filename}`;
      courseData.image = image;
    }
    if (project) {
      courseData.projectDuration = projectDuration;
    }
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: "Course created successfully",
      savedCourse: savedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      title,
      description,
      category,
      teacher,
      lessons,
      maxPoints,
      project,
      projectDuration,
    } = req.body;

    const unexpectedFields = Object.keys(req.body).filter(
      (field) =>
        ![
          "title",
          "description",
          "category",
          "teacher",
          "lessons",
          "courses",
          "maxPoints",
          "projectDuration",
          "project",
        ].includes(field)
    );
    if (unexpectedFields.length > 0) {
      return next(errorHandler(400, "Unexpected fields"));
    }
    const courseData = {
      title,
      description,
      category,
      teacher,
      lessons,
      maxPoints,
      project,
    };
    if (req.file) {
      const image = `${req?.file?.fieldname}/${req?.file?.filename}`;
      courseData.image = image;
    }
    if (project) {
      courseData.projectDuration = projectDuration;
    }
    const courseId = req.params.courseId;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: courseData },
      { new: true }
    );
    if (!updatedCourse) {
      return next(errorHandler(404, "Course not found"));
    }
    res.status(200).json({
      message: "Course updated successfully",
      updatedCourse: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const courseId = req.params.courseId;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return next(errorHandler(404, "Course not found"));
    }
    res.status(200).json({
      message: "Course deleted successfully",
      deletedCourse: deletedCourse,
    });
  } catch (error) {
    next(error);
  }
};

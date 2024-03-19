import Course from "../models/course.model.js";
import { errorHandler } from "../middleware/errorHandler.js";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    next(error);
  }
}

export const createCourse = async (req, res, next) => {
  try {
    const newCourse = new Course({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      duration: req.body.duration,
      teachers: req.body.teachers,
      lessons: req.body.lessons
    });
    const savedCourse = await newCourse.save();
    res.status(201).json({
      message: "Course created successfully",
      savedCourse: savedCourse
    })
  } catch (error) {
    next(error);
  }
}

export const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        duration: req.body.duration,
        teachers: req.body.teachers,
        lessons: req.body.lessons
      }
    }, { new: true });
    if (!updatedCourse) {
      return next(errorHandler(404, "Course not found"));
    }
    res.status(200).json({
      message: "Course updated successfully",
      updatedCourse: updatedCourse
    })
  } catch (error) {
    next(error);
  }
}

export const deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
    if (!deletedCourse) {
      return next(errorHandler(404, "Course not found"));
    }
    res.status(200).json({
      message: "Course deleted successfully",
      deletedCourse: deletedCourse
    })
  } catch (error) {
    next(error)
  }
}

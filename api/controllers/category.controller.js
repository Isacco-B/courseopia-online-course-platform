import { errorHandler } from "../middleware/errorHandler.js";
import {
  CourseCategory,
  LessonCategory,
  MasterCategory,
} from "../models/category.model.js";
import { validationResult } from "express-validator";

export const getCategories = async (req, res, next) => {
  try {
    let categories;
    const { type } = req.query;
    switch (type) {
      case "lesson":
        categories = await LessonCategory.find();
        break;
      case "course":
        categories = await CourseCategory.find();
        break;
      case "master":
        categories = await MasterCategory.find();
        break;
      default:
        throw errorHandler(400, "Invalid category type");
    }
    if (!categories) {
      return next(errorHandler(404, "Categories not found"));
    }
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let CategoryModel;
    const { type } = req.query;
    switch (type) {
      case "lesson":
        CategoryModel = LessonCategory;
        break;
      case "course":
        CategoryModel = CourseCategory;
        break;
      case "master":
        CategoryModel = MasterCategory;
        break;
      default:
        throw errorHandler(400, "Invalid category type");
    }
    const category = new CategoryModel({
      title: req.body.title,
    });
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully",
      savedCategory: savedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let CategoryModel;
    const { type } = req.query;
    switch (type) {
      case "lesson":
        CategoryModel = LessonCategory;
        break;
      case "course":
        CategoryModel = CourseCategory;
        break;
      case "master":
        CategoryModel = MasterCategory;
        break;
      default:
        throw errorHandler(400, "Invalid category type");
    }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { $set: { title: req.body.title } },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Category updated successfully",
      updatedCategory: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let CategoryModel;
    const { type } = req.query;
    switch (type) {
      case "lesson":
        CategoryModel = LessonCategory;
        break;
      case "course":
        CategoryModel = CourseCategory;
        break;
      case "master":
        CategoryModel = MasterCategory;
        break;
      default:
        throw errorHandler(400, "Invalid category type");
    }
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      req.params.categoryId
    );
    res.status(200).json({
      message: "Category deleted successfully",
      deletedCategory: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};

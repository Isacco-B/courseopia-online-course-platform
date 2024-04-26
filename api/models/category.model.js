import mongoose from "mongoose";
import slugify from "slugify";

const lessonCategoryShema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Category title is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

lessonCategoryShema.pre("save", function (next) {
  try {
    this.slug = slugify(this.title, { lower: true });
    next();
  } catch (error) {
    next(error);
  }
});

export const LessonCategory = mongoose.model(
  "LessonCategory",
  lessonCategoryShema
);

const courseCategoryShema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Category title is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

courseCategoryShema.pre("save", function (next) {
  try {
    this.slug = slugify(this.title, { lower: true });
    next();
  } catch (error) {
    next(error);
  }
});

export const CourseCategory = mongoose.model(
  "CourseCategory",
  courseCategoryShema
);

const masterCategoryShema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Category title is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

masterCategoryShema.pre("save", function (next) {
  try {
    this.slug = slugify(this.title, { lower: true });
    next();
  } catch (error) {
    next(error);
  }
});

export const MasterCategory = mongoose.model(
  "MasterCategory",
  masterCategoryShema
);

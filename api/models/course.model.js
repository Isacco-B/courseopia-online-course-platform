import mongoose from "mongoose";
import slugify from "slugify";
import Lesson from "./lesson.model.js";

const courseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Course name is required"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseCategory",
      required: [true, "Course category is required"],
    },
    theoryDuration: {
      type: Number,
    },
    projectDuration: {
      type: Number,
    },
    maxPoints: {
      type: Number,
      required: [true, "Course maxPoints is required"],
    },
    image: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course teacher is required"],
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: [true, "Course lesson is required"],
      },
    ],
    project: {
      type: Boolean,
      default: true,
      required: [true, "Course project is required"],
    },
  },
  { timestamps: true }
);

courseSchema.pre("save", async function (next) {
  try {
    this.slug = slugify(this.title, { lower: true });

    const courseLessons = await Lesson.find({
      _id: {
        $in: this.lessons,
      },
    });
    let courseDuration = 0;
    if (courseLessons) {
      courseLessons.forEach((lesson) => {
        courseDuration += lesson.duration;
      });
    }
    this.theoryDuration = Number(courseDuration);
    next();
  } catch (error) {
    next(error);
  }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;

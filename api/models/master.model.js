import mongoose from "mongoose";
import slugify from "slugify";
import Course from "./course.model.js";

const masterSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Master title is required"],
    },
    description: {
      type: String,
      required: [true, "Master description is required"],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Master course is required"],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterCategory",
    },
    duration: {
      type: Number,
    },
  },
  { timestamps: true }
);

masterSchema.pre("save", async function (next) {
  try {
    this.slug = slugify(this.title, { lower: true });

    const masterCourses = await Course.find({
      _id: {
        $in: this.courses,
      },
    });
    let masterDuration = 0;
    if (masterCourses) {
      masterCourses.forEach((course) => {
        masterDuration += course.theoryDuration;
        if (course.project) {
          masterDuration += course.projectDuration;
        }
      });
    }
    this.duration = Number(masterDuration);
    next();
  } catch (error) {
    next(error);
  }
});

const Master = mongoose.model("Master", masterSchema);
export default Master;

import mongoose from "mongoose";
import slugify from "slugify";

const LessonSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
    },
    content: {
      type: String,
      required: [true, "Lesson content is required"],
    },
    duration: {
      type: Number,
      required: [true, "Lesson duration is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LessonCategory",
      required: [true, "Lesson category is required"],
    },
  },
  { timestamps: true }
);

LessonSchema.pre("save", async function (next) {
  try {
    this.slug = slugify(this.title + " " + new Date(this.createdAt).toISOString(), { lower: true });
    next();
  } catch (error) {
    next(error);
  }
})

const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;

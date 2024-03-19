import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false,
  },
});

const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;

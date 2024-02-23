import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Course name is required"],
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
  },
  category: {
    type: String,
    required: [true, "Course category is required"],
  },
  duration: {
    type: Number,
    required: [true, "Course duration is required"],
  },
  price: {
    type: Number,
    required: [true, "Course price is required"],
  },
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course teacher is required"],
    },
  ],
})

const Course = mongoose.model("Course", courseSchema);
export default Course;

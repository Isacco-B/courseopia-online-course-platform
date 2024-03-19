import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
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
  duration: {
    type: Number,
    required: [true, "Master duration is required"],
  },
},{datatimes: true});

const Master = mongoose.model("Master", masterSchema);
export default Master;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Your name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Your last name is required"],
    },
    email: {
      type: String,
      required: [true, "Your email address is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";
import Profile from "./profile.model.js";
import slugify from "slugify";

const userSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
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
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    currentMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Master",
    },
    coursesCompleted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    lessonsCompleted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    this.slug = slugify(`${this.firstName}-${this.lastName}`, { lower: true });
    const profile = await Profile.create({ user: this._id });
    this.profile = profile._id;
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;

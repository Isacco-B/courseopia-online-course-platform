import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    // Personal Info
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    phoneNumber: {
      type: String,
      max: 12,
      required: [true, "Your phone number is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Your date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Your gender is required"],
    },
    city: {
      type: String,
      required: [true, "Your city is required"],
    },
    // Description
    description: {
      type: String,
    },
    // Work Info
    isWorking: {
      type: Boolean,
      default: false,
    },
    lookingForJob: {
      type: Boolean,
      default: false,
    },
    remoteWork: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: String,
      enum: ["full time", "part time"],
      default: "full time",
    },
    // Education Info
    education: {
      type: String,
      enum: ["high school", "bachelor", "master", "doctorate"],
      default: "high school",
    },
    graduationDate: {
      type: Date,
    },
    // Social Info
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    github: {
      type: String,
    },
    website: {
      type: String,
    },
    // Skills
    hardSkills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    // Certifications
    certifications: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

profileSchema.pre("remove", async function (next) {
  try {
    await User.deleteOne({ _id: this.user });
    next();
  } catch (error) {
    next(error);
  }
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;

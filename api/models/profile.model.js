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
    },
    phoneNumber: {
      type: String,
      max: 12,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    city: {
      type: String,
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
    },
    // Education Info
    education: {
      type: String,
      enum: [
        "Licenza media",
        "Diploma di scuola superiore",
        "Laurea",
        "Laurea magistrale",
        "Master universitario",
        "Dottorato di ricerca",
      ],
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
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;

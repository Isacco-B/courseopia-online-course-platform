import mongoose from "mongoose";

const accountVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
  },
  { timestamps: true }
);

accountVerificationSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 300 });

const AccountVerification = mongoose.model(
  "AccountVerification",
  accountVerificationSchema
);

export default AccountVerification;

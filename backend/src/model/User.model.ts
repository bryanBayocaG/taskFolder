import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true, required: true },
    email: { type: String, unique: true, sparse: true },
    displayName: { type: String },
    photoURL: { type: String },
    authProvider: {
      type: String,
      enum: ["google", "email-password"],
      required: true,
    },
    additionalInfo: {
      phoneNumber: { type: String, sparse: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
      isActive: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

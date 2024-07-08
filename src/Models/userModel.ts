import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerfied: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  isDriver: { type: Boolean, default: false },
  driverLicense: { type: String },
  vehicleInfo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

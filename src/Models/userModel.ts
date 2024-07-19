import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // General user fields
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    profilePicture: { type: String },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    // Account status and verification
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,

    // User ratings and activity
    passengerRating: { type: Number, default: 0 },
    totalRidesAsTakenPassenger: { type: Number, default: 0 },

    // Driver-specific fields
    isDriver: { type: Boolean, default: false },
    driverVerificationStatus: {
      type: String,
      enum: ["Not Applied", "Pending", "Approved", "Rejected"],
      default: "Not Applied",
    },
    driverLicense: {
      requestId: { type: String },
      number: { type: String },
      expirationDate: { type: Date },
      state: { type: String },
      documentUrl: { type: String }, // URL to the uploaded document
    },
    vehicleInfo: {
      make: { type: String },
      model: { type: String },
      year: { type: Number },
      color: { type: String },
      licensePlate: { type: String },
      verificationResult: { type: Object },
    },
    driverRating: { type: Number, default: 0 },
    totalRidesAsDriver: { type: Number, default: 0 },
    driverAvailabilityStatus: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Offline",
    },
    earnings: { type: Number, default: 0 },
    bankAccountInfo: {
      accountNumber: String,
      bankName: String,
      accountHolderName: String,
      ifscCode: String,
    },

    // Preferences
    preferredLanguage: { type: String, default: "English" },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // This will automatically update the updatedAt field
  }
);

// Indexes for optimizing queries
userSchema.index({ email: 1, phoneNumber: 1 });
userSchema.index({ isDriver: 1, driverAvailabilityStatus: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user is an active driver
userSchema.methods.isActiveDriver = function () {
  return this.isDriver && this.driverVerificationStatus === "Approved";
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

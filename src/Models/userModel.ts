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
    totalRidesAsTakenPassenger: { type: Number, default: 0 },
    totalDistanceTraveled: { type: Number, default: 0 }, // in kilometers
    reviewsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    reviewsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

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
      documentUrl: { type: String },
    },
    vehicleInfo: {
      make: { type: String },
      model: { type: String },
      year: { type: Number },
      color: { type: String },
      licensePlate: { type: String },
      verificationResult: { type: Object },
      capacity: { type: Number, default: 4 },
      features: [String], // e.g., ["AC", "WiFi", "Pet Friendly"]
    },
    totalRidesAsDriver: { type: Number, default: 0 },
    driverAvailabilityStatus: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Offline",
    },
    passengerRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    driverRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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
    ridePreferences: {
      musicPreference: { type: String },
      temperaturePreference: { type: Number },
      chatPreference: {
        type: String,
        enum: ["Chatty", "Quiet", "No Preference"],
      },
    },

    // Safety and Trust
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
    safetyRating: { type: Number, default: 0 },
    verifiedBadges: [String], // e.g., ["Phone Verified", "Email Verified", "ID Verified"]

    // Loyalty and Rewards
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimizing queries
userSchema.index({ email: 1, phoneNumber: 1 });
userSchema.index({ isDriver: 1, driverAvailabilityStatus: 1 });
userSchema.index({ loyaltyPoints: -1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user is an active driver
userSchema.methods.isActiveDriver = function () {
  return this.isDriver && this.driverVerificationStatus === "Approved";
};

// Method to calculate user's age
userSchema.methods.getAge = function () {
  return Math.floor(
    (new Date().getTime() - this.dateOfBirth.getTime()) / 3.15576e10
  );
};

// Method to update loyalty tier based on points
userSchema.methods.updateMembershipTier = function () {
  if (this.loyaltyPoints >= 10000) this.membershipTier = "Platinum";
  else if (this.loyaltyPoints >= 5000) this.membershipTier = "Gold";
  else if (this.loyaltyPoints >= 1000) this.membershipTier = "Silver";
  else this.membershipTier = "Bronze";
};
// Method to calculate average rating

userSchema.methods.calculateAverageRating = async function (type: string) {
  const reviews = type === "driver" ? this.reviewsReceived : this.reviewsGiven;
  if (reviews.length === 0) return 0;

  const Review = mongoose.model("Review");
  const populatedReviews = await Review.find({ _id: { $in: reviews } });

  const sum = populatedReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / populatedReviews.length;
};

// Method to update ratings
userSchema.methods.updateRatings = async function () {
  this.driverRating = await this.calculateAverageRating("driver");
  this.passengerRating = await this.calculateAverageRating("passenger");
  await this.save();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

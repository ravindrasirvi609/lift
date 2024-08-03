import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  rating: { type: Number, required: true, min: 0.5, max: 5 },
  driverRating: { type: Number, min: 0.5, max: 5 },
  vehicleRating: { type: Number, min: 0.5, max: 5 },
  punctualityRating: { type: Number, min: 0.5, max: 5 },
  comment: { type: String },
  reviewerRole: {
    type: String,
    enum: ["passenger", "driver"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isEdited: { type: Boolean, default: false },
  lastEditedAt: { type: Date },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to update user ratings after a review is saved
reviewSchema.post("save", async function (doc) {
  const User = mongoose.model("User");
  const reviewer = await User.findById(doc.reviewer);
  const reviewed = await User.findById(doc.reviewed);

  reviewer.reviewsGiven.push(doc._id);
  reviewed.reviewsReceived.push(doc._id);

  await Promise.all([
    reviewer.save(),
    reviewed.save(),
    reviewer.updateRatings(),
    reviewed.updateRatings(),
  ]);
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;

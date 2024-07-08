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
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;

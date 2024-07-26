import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  numberOfSeats: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  price: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Refunded", "Failed"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Credit Card", "Debit Card", "Digital Wallet"],
  },
  pickupLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
    address: { type: String },
  },
  dropoffLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
    address: { type: String },
  },
  actualPickupTime: { type: Date },
  actualDropoffTime: { type: Date },
  cancellationReason: { type: String },
  cancellationFee: { type: Number, default: 0 },
  specialRequests: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.index({ ride: 1, passenger: 1 }, { unique: true });
bookingSchema.index({
  pickupLocation: "2dsphere",
  dropoffLocation: "2dsphere",
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;

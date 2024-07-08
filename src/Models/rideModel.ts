import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  startLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  endLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  startAddress: { type: String, required: true },
  endAddress: { type: String, required: true },
  departureTime: { type: Date, required: true },
  estimatedArrivalTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rideSchema.index({ startLocation: "2dsphere", endLocation: "2dsphere" });

const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);
export default Ride;

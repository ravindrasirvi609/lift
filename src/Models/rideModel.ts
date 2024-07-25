import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: {
    type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    licensePlate: { type: String, required: true },
  },
  startLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    city: { type: String, required: true },
    region: { type: String, required: true },
    locationId: { type: String, required: true },
    address: { type: String, required: true },
  },
  endLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    city: { type: String, required: true },
    region: { type: String, required: true },
    locationId: { type: String, required: true },
    address: { type: String, required: true },
  },
  waypoints: [
    {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
      address: { type: String },
    },
  ],
  departureTime: { type: Date, required: true },
  estimatedArrivalTime: { type: Date, required: true },
  actualDepartureTime: { type: Date },
  actualArrivalTime: { type: Date },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  distance: { type: Number }, // in kilometers
  duration: { type: Number }, // in minutes
  route: { type: String }, // Encoded polyline of the route
  recurrence: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"] },
    endDate: { type: Date },
  },
  allowedLuggage: { type: String },
  amenities: [{ type: String }], // e.g., ["WiFi", "Air Conditioning", "Pet Friendly"]
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  totalEarnings: { type: Number, default: 0 },
  cancellationReason: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rideSchema.index({ startLocation: "2dsphere", endLocation: "2dsphere" });
rideSchema.index({ departureTime: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });

const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);
export default Ride;

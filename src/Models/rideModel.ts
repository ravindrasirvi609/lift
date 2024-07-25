import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicle: {
    type: { type: String },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    color: { type: String },
    licensePlate: { type: String },
  },
  startLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] }, // [longitude, latitude]
    city: { type: String },
    region: { type: String },
    locationId: { type: String },
    address: { type: String },
  },
  endLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] }, // [longitude, latitude]
    city: { type: String },
    region: { type: String },
    locationId: { type: String },
    address: { type: String },
  },
  waypoints: [
    {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
      address: { type: String },
    },
  ],
  departureTime: { type: Date },
  estimatedArrivalTime: { type: Date },
  actualDepartureTime: { type: Date },
  actualArrivalTime: { type: Date },
  totalSeats: { type: Number },
  availableSeats: { type: Number },
  price: { type: Number },
  pricePerSeat: { type: Number },
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

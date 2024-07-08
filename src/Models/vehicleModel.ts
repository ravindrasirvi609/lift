import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  vehicleType: {
    type: String,
    enum: ["Sedan", "SUV", "Van", "Other"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;

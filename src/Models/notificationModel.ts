import mongoose, { Schema } from "mongoose";

const NotificationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      "ride_request",
      "ride_accepted",
      "ride_cancelled",
      "payment_received",
      "system_alert",
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: "type",
    required: false,
  },
});

// Index for sorting notifications by creation date
NotificationSchema.index({ createdAt: -1 });

// Index for querying unread notifications
NotificationSchema.index({ userId: 1, read: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
export default Notification;

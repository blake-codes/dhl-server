import mongoose from "mongoose";

// Order schema
const orderSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  shipmentName: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  currentLocation: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  status: {
    type: String,
  },
  weight: { type: String },
  dimensions: { type: String },
  locationUpdates: [{ date: Date, location: String }],
  movementHistory: [
    {
      movementLocation: { type: String, required: true },
      movementDate: { type: Date, required: true },
      movementStatus: { type: String, required: true },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Order = mongoose.model("Order", orderSchema);

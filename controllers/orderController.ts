import { Request, Response } from "express";
import { Order } from "../models/Order";
import { User } from "../models/User";

const generateTrackingNumber = () => {
  return `DHL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const createOrder = async (req: any, res: any) => {
  const {
    username,
    password,
    shipmentName,
    origin,
    destination,
    currentLocation,
    senderName,
    receiverName,
    receiverEmail,
    receiverPhone,
    receiverAddress,
    status,
    weight,
    assignedOldUser,
    dimensions,
    movementHistory,
  } = req.body;
  let user;
  try {
    if (username && assignedOldUser) {
      return res.status(400).json({
        message: "You cant enter a username and assign order to a user",
      });
    }
    if (username && password) {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create a new user
      user = new User({ username, password });
      await user.save();
    } else {
      user = await User.findOne({ username: assignedOldUser });
      if (!user) {
        return res
          .status(400)
          .json({ message: "No user with entered username" });
      }
    }

    // Now create the order
    const trackingNumber = generateTrackingNumber();

    const order = new Order({
      trackingNumber,
      shipmentName,
      origin,
      destination,
      currentLocation,
      senderName,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverAddress,
      status,
      weight,
      dimensions,
      locationUpdates: [],
      movementHistory, // Initial movement history
      user: user._id, // Link the order to the created user
    });

    await order.save();

    // Return the created order along with user info
    res.status(201).json({ order, user: { username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Explicit return type added
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { trackingNumber } = req.params;
  const { username, password, ...updateData } = req.body;

  try {
    if (username && password) {
      await User.findOneAndUpdate(
        { username },
        { $set: { password } },
        { new: true }
      );
    }

    const order = await Order.findOneAndUpdate(
      { trackingNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

export const addMovementHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { trackingNumber } = req.params;
  const { movementLocation, movementDate, movementStatus } = req.body;

  // Validate request body
  if (!movementLocation || !movementDate || !movementStatus) {
    res.status(400).json({ message: "Missing required movement details" });
    return;
  }

  try {
    const order = await Order.findOneAndUpdate(
      { trackingNumber },
      {
        $push: {
          movementHistory: { movementLocation, movementDate, movementStatus },
        },
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({
      message: "Movement history added successfully",
      order,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
};

export const getOrder = async (req: any, res: any) => {
  const { trackingNumber } = req.params;
  try {
    const order = await Order.findOne({ trackingNumber }).populate("user");
    return res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error Getting Order" });
  }
};
export const deleteOrder = async (req: any, res: any) => {
  const { trackingNumber } = req.params;

  try {
    await Order.findOneAndDelete({ trackingNumber });
    return res.json({
      status: true,
      messsage: "Order Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: "Error Deleting Order" });
  }
};

export const getAllOrders = async (req: any, res: any) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error Deleting Order" });
  }
};

export const getOrdersByUsername = async (req: any, res: any) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: user._id }).populate("user");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

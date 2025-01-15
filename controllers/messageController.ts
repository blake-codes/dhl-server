import { Message } from "../models/Message";

export const getAllMessages = async (req: any, res: any) => {
  const messages = await Message.find({});
  return res.status(200).json(messages);
};

export const getMessageById = async (req: any, res: any) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }
  res.status(200).json(message);
};

export const sendMessage = async (req: any, res: any) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const newMessage = new Message({ name, email, message });
  await newMessage.save();
  res
    .status(201)
    .json({ message: "Message sent successfully.", data: newMessage });
};

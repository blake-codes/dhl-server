import { User } from "../models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "jdueusjs";

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ username, token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const healthCheck = async (req: any, res: any) => {
  res.status(200).json({ status: true });
};

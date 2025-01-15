import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.comparePassword = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};

export const User = mongoose.model("User", userSchema);

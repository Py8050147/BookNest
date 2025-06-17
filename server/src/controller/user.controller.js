import { UserSchema } from "../models/userModels/user.models";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
  audience: "{yourApiIdentifier}",
  issuerBaseURL: "https://dev-oxfjntjxamb3rv1k.us.auth0.com/",
});

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User;
    Schema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();
    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Return the user and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

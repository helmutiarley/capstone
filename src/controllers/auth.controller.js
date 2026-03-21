import {
  createUser,
  findUserByEmail,
} from "../repositories/users.repository.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

export async function register(req, res) {
  // FEATURE: add input validation and sanitization
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const passwordHash = await bcryptjs.hash(password, saltRounds);
    // Create the user
    const newUser = await createUser(email, passwordHash);
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    // FEATURE: add better error handling and logging
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
}

export async function login(req, res) {
  // FEATURE: add input validation and sanitization
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    // FEATURE: add better error handling and logging
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

export async function logout(req, res) {
  try {
    // Clear the auth token cookie
    res.clearCookie("authToken");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    // FEATURE: add better error handling and logging
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
}

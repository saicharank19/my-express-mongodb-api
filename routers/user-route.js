import { userModel } from "../models/user-model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express from "express";
//zZCm9sxO86lDLERw
//saicharankadiyala

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ username });

  if (existingUser) {
    // If the user exists, return the response immediately
    return res.status(409).json({ message: `${username} already exists.` });
  }

  // If the user doesn't exist, create a new user
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: `${username} account created successfully.` });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userFound = await userModel.findOne({ username });

  if (userFound) {
    const verifyPassword = await bcrypt.compare(password, userFound.password);
    if (verifyPassword) {
      const token = jwt.sign({ id: userFound._id }, process.env.SECRET);
      return res.status(200).json({ token, user: userFound._id });
    }
    return res.status(401).json({ message: "incorrect username or password" });
  }
  return res.json({ message: "user not found" });
});

function verifyJsonWebToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const isVerified = jwt.verify(token, process.env.SECRET);

      if (isVerified) {
        req.id = isVerified.id;
        next();
      } else {
        return res.status(400).json({ message: "unauthorized to access" });
      }
    }
  } catch (err) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
}

router.delete("/delete", verifyJsonWebToken, async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ username });

  if (!existingUser) {
    // If the user not exists, return the response immediately
    return res.status(409).json({ message: `${username} not exists.` });
  }

  // If the user exist,delete the user
  try {
    const hashedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (hashedPassword) {
      await userModel.deleteOne({ username: username });
      return res
        .status(200)
        .json({ message: `${username} account deleted successfully.` });
    }
    return res.json({ message: "incorrect password" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
});

export { router, verifyJsonWebToken };

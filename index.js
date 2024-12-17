import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cros from "cors";
import { router as userRouter } from "./routers/user-route.js";
import { router as todoRouter } from "./routers/todo-route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cros());

app.use("/user", userRouter);
app.use("/todo", todoRouter);

mongoose.connect(process.env.MONGODB_URI);
console.log("DB CONNECTED");

let PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  return res.status(201).json({ message: "db health is good" });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

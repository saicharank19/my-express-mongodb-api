import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cros from "cors";
import { router as userRouter } from "./routers/user-route.js";
import { router as todoRouter } from "./routers/todo-route.js";
import { Request, Response, Express } from "express";
dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(cros());

app.use("/user", userRouter);
app.use("/todo", todoRouter);

mongoose.connect(process.env.MONGODB_URI as string);
console.log("DB CONNECTED");

let PORT = process.env.PORT || 3000;

app.get("/health", (req: Request, res: Response): any => {
  return res.status(201).json({ message: "db health is good" });
});
app.listen(PORT as number, () => {
  console.log(`Server running on port ${PORT}`);
});

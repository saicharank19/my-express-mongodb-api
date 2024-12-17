import { todoModel } from "../models/todo-model.js";
import dotenv from "dotenv";
import { verifyJsonWebToken } from "./user-route.js";
import express from "express";

dotenv.config();

const router = express.Router();

//creates task
router.post("/createtask", verifyJsonWebToken, async (req, res) => {
  const userId = req.id;
  const { title, description } = req.body;
  const newTodo = new todoModel({ title, description, user: userId });
  await newTodo.save();
  return res.status(201).json({ message: "todo created successfully" });
});

//changes the task status
router.put("/updatestatus", verifyJsonWebToken, async (req, res) => {
  const { todoId } = req.body;
  const todoExists = await todoModel.findOne({ _id: todoId });
  if (todoExists) {
    todoExists.isDone = !todoExists.isDone;
    todoExists.save();
    return res
      .status(200)
      .json(
        `${todoExists.description} marked as ${
          todoExists.isDone ? "completed" : "not completed"
        }`
      );
  }
  return res.json({ message: "todo not found" });
});

//edits title and description
router.put("/edit", verifyJsonWebToken, async (req, res) => {
  const { todoId, title, description } = req.body;
  const todoExists = await todoModel.findOne({ _id: todoId });
  if (todoExists) {
    todoExists.title = title;
    todoExists.description = description;
    todoExists.save();
    return res.status(200).json(todoExists);
  }
  return res.json({ message: "todo not found" });
});

//gets specific todo
router.get("/gettodo", verifyJsonWebToken, async (req, res) => {
  const { todoId } = req.body;
  const todoExists = await todoModel.findOne({ _id: todoId });
  if (todoExists) {
    return res.status(200).json(todoExists);
  }
  return res.json({ message: "todo not found" });
});

//gets all tasks
router.get("/alltodo", verifyJsonWebToken, async (req, res) => {
  const { userId } = req.id;
  const alltasks = [];
  (await todoModel.find({ userId })).forEach((each) => {
    alltasks.push({ title: each.title, description: each.description });
  });
  return res.status(201).json(alltasks);
});

//gets all tasks for current date
router.get("/today", verifyJsonWebToken, async (req, res) => {
  const { userId } = req.id;

  // Get today's date at 00:00:00 and end of today at 23:59:59
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59)

  // Fetch tasks created today for the given userId
  const todayTasks = await todoModel.find({
    userId,
    createdAt: {
      $gte: startOfToday, // greater than or equal to the start of today
      $lte: endOfToday, // less than or equal to the end of today
    },
  });

  // Return the filtered tasks
  const tasks = todayTasks.map((each) => ({
    title: each.title,
    description: each.description,
  }));

  return res.status(200).json(tasks);
});

//gets all completed tasks
router.get("/completed", verifyJsonWebToken, async (req, res) => {
  const { userId } = req.id;
  const completedtasks = [];
  (await todoModel.find({ userId, isDone: true })).forEach((each) => {
    completedtasks.push({
      title: each.title,
      description: each.description,
      isDone: each.isDone,
    });
  });
  return res.status(201).json(completedtasks);
});

//gets all incomplete tasks
router.get("/incomplete", verifyJsonWebToken, async (req, res) => {
  const { userId } = req.id;
  const incompletetasks = [];
  (await todoModel.find({ userId, isDone: false })).forEach((each) => {
    incompletetasks.push({
      title: each.title,
      description: each.description,
      isDone: each.isDone,
    });
  });
  return res.status(201).json(incompletetasks);
});

//delete one todo
router.delete("/delete", verifyJsonWebToken, async (req, res) => {
  const { todoId } = req.body;
  const todoExists = await todoModel.findByIdAndDelete({ _id: todoId });
  if (!todoExists) {
    return res.status(200).json({ message: "todo deleted successfully" });
  }
  return res.json({ message: "todo not found" });
});

export { router };

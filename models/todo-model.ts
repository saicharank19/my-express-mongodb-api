import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    //description: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    user: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

export const todoModel = mongoose.model("todos", todoSchema);

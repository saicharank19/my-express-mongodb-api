import { Types } from "mongoose";

export interface Todo {
  todoId: string;
  title: string;
}
export interface TitleList {
  title: string;
  status: boolean;
  todoId: Types.ObjectId;
}
export interface Tasks {
  title: string;
  isDone: boolean;
}

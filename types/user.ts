import { Request, Response, NextFunction } from "express";

export interface CreateUser {
  email: string;
  username: string;
  password: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

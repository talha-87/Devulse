import { Request, Response } from "express";

import {
  signupService,
  loginService,
} from "./auth.service";


export const signupController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await signupService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================
// USER LOGIN
// ========================
export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
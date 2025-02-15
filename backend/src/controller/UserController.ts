import { Request, Response } from "express";
import User from "../model/User.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { uid, email, displayName, photoURL, authProvider, additionalInfo } =
      req.body;
    if (!uid || !authProvider) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: uid and authProvider are required.",
      });
    }
    const newUser = new User({
      uid,
      email,
      displayName,
      photoURL,
      authProvider,
      additionalInfo,
    });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User Created", data: newUser });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "User not created",
      error: error.message,
    });
  }
};

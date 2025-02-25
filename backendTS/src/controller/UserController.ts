import { Request, Response } from "express";
import User from "../model/User.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      uid,
      email,
      password,
      displayName,
      photoURL,
      authProvider,
      additionalInfo,
    } = req.body;
    if (!uid || !authProvider) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: uid and authProvider are required.",
      });
    }
    const userExist = await User.findOne({ uid, email });
    if (userExist) {
      return res.status(200).json({
        success: true,
        message: "User exists",
        data: userExist,
      });
    }
    const newUser = new User({
      uid,
      email,
      password,
      displayName,
      photoURL,
      authProvider,
      additionalInfo,
    });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User Created", data: newUser });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    }
  }
};

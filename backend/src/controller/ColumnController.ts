import { Request, Response } from "express";
import Column from "../model/Column.model";
import User from "../model/User.model";

export const addColumn = async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;
    const { columnName } = req.body;
    if (!columnName) {
      return res.status(400).json({ message: "column name invalid" });
    }
    const columnExist = await Column.findOne({ columnName });
    if (columnExist) {
      return res.status(400).json({ message: "column name already exist" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newColumn = new Column({
      columnName,
      createdBy: user._id,
    });
    await newColumn.save();
    res
      .status(201)
      .json({ success: true, message: "column created", data: newColumn });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", typeOfError: error.message });
    }
  }
};

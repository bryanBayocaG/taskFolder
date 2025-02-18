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

    const columnCount = await Column.countDocuments({ createdBy: user._id });

    const newColumn = new Column({
      columnName,
      createdBy: user._id,
      position: columnCount,
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

export const getColumns = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const columns = await Column.find({ createdBy: user._id })
      .select("-__v -createdAt -updatedAt")
      .sort({ position: 1 });
    if (columns.length === 0) {
      return res.status(200).json({ message: "No columns found", data: [] });
    }
    return res.status(200).json({ success: true, data: columns });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", typeOfError: error.message });
    }
  }
};

export const deleteColumns = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Column.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "column not found or not deleted" });
    }
    return res.status(200).json({ message: "column deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", error: error.message });
    }
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //updates lang kase yung key sa body same lang sa field na papalitan, short hand principle
    const updatedColumn = await Column.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    return res
      .status(200)
      .json({ message: "Column updated successfully", data: updatedColumn });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
};

export const reorderColumns = async (req: Request, res: Response) => {
  try {
    const { activeID, overID } = req.params;

    const activeCol = await Column.findById(activeID);
    const overCol = await Column.findById(overID);

    if (!activeCol || !overCol) {
      return res.status(404).json({ message: "One or both columns not found" });
    }

    const tempPosition = activeCol.position;
    activeCol.position = overCol.position;
    overCol.position = tempPosition;

    await activeCol.save();
    await overCol.save();

    return res
      .status(200)
      .json({ success: true, message: "Columns reordered successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error updating columns", error: error.message });
    }
  }
};

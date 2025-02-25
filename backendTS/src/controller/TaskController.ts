import { Request, Response } from "express";
import Column from "../model/Column.model";
import Task from "../model/Task,model";
import User from "../model/User.model";

type TaskType = {
  id: number | string;
  content: string;
  position: number;
  columnID: string | number;
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const tasks = await Task.find({ createdBy: user._id })
      .select("-__v -createdAt -updatedAt")
      .sort({ position: 1 });
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No columns found", data: [] });
    }
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", typeOfError: error.message });
    }
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const { columnID, content } = req.body;
    const { uid } = req.params;
    if (!columnID || !content) {
      return res.status(400).json({ message: "please provide correct fields" });
    }
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const findValidColumn = await Column.findOne({
      createdBy: user._id,
      _id: columnID,
    });
    if (!findValidColumn) {
      return res.status(403).json({ meseage: "accessing invalid column" });
    }
    const duplicateTask = await Task.findOne({ content });
    if (duplicateTask) {
      return res.status(409).json({ message: "task already exist" });
    }
    const taskCount = await Task.countDocuments({
      columnID,
      createdBy: user._id,
    });
    const newTask = new Task({
      columnID,
      createdBy: user._id,
      content,
      position: taskCount,
    });
    await newTask.save();

    res.status(200).json({
      success: true,
      message: "task added succesfully",
      data: newTask,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", error: error.message });
    }
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    return res.json(200).json({ message: "editTask" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", typeOfError: error.message });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    return res.json(200).json({ message: "delTask" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "error mo show mo", typeOfError: error.message });
    }
  }
};

export const reorderTask = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    const bulkOperations = tasks.map((task: TaskType, index: number) => ({
      updateOne: {
        filter: { _id: task.id },
        update: { position: index, columnID: task.columnID }, // Ensure columnID updates
      },
    }));

    await Task.bulkWrite(bulkOperations);

    return res
      .status(200)
      .json({ success: true, message: "Tasks reordered successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error updating tasks", error: error.message });
    }
  }
};

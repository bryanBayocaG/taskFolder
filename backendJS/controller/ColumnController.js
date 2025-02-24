import Board from "../model/Board.model.js";
import Column from "../model/Column.model.js";
import User from "../model/User.model.js";

export const addColumn = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const { columnName } = req.body;
    if (!columnName) {
      return res.status(400).json({ message: "column name invalid" });
    }
    const columnExist = await Column.findOne({ columnName });
    if (columnExist) {
      return res.status(409).json({ message: "column name already exist" });
    }
    const boardExist = await Board.findOne({ _id: id });
    if (!boardExist) {
      return res.status(404).json({ message: "board not found" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const columnCount = await Column.countDocuments({ createdBy: user._id });

    const newColumn = new Column({
      columnName,
      createdBy: user._id,
      boardFrom: id,
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

export const getColumns = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const columns = await Column.find({ boardFrom: id, createdBy: user._id })
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

export const deleteColumns = async (req, res) => {
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

export const updateColumn = async (req, res) => {
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

export const reorderColumns = async (req, res) => {
  try {
    const { columns } = req.body;

    const bulkOperations = columns.map((col, index) => ({
      updateOne: {
        filter: { _id: col.id },
        update: { position: index },
      },
    }));
    await Column.bulkWrite(bulkOperations);
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

import User from "../model/User.model.js";
import Board from "../model/Board.model.js";

export const addBoard = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    const { boardName, description, boardImg } = req.body;
    if (!boardName || !description) {
      return res
        .status(400)
        .json({ message: "board name and descriction not provided" });
    }
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const boardExist = await Board.findOne({ boardName });
    if (boardExist) {
      return res.status(400).json({ message: "board already exist" });
    }
    const newBoard = new Board({
      boardName,
      description,
      boardImg,
      createdBy: user._id,
    });
    await newBoard.save();
    res
      .status(201)
      .json({ success: true, message: "board created", data: newBoard });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getBoard = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const boards = await Board.find({ createdBy: user._id });
    if (boards.length === 0) {
      return res.status(200).json({ message: "no boards found", data: [] });
    }
    res.status(200).json({ success: true, data: boards });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
export const deleteBoard = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const result = await Board.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "board not found or not deleted" });
    }
    return res.status(200).json({ message: "board deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
export const updateBoard = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const updates = req.body;
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const updatedColumn = await Board.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedColumn) {
      return res.status(404).json({ message: "board not found" });
    }

    return res
      .status(200)
      .json({ message: "board updated successfully", data: updatedColumn });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

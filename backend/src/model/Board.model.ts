import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    boardName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    boardImg: { type: String, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
export default Board;

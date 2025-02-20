import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    boardName: { type: String, required: true },
    description: { type: String, required: true },
    boardImg: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Column = mongoose.model("Board", boardSchema);
export default Column;

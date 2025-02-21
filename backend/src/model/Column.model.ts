import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    columnName: { type: String, required: true },
    position: { type: Number, require: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    boardFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);
export default Column;

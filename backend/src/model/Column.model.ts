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
    // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);
export default Column;

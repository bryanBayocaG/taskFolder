import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    columnID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    content: { type: String, require: true },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;

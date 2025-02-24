import express from "express";
import { createUser } from "../controller/UserController";
import { logInUser } from "../controller/auth/authController";
import {
  addColumn,
  deleteColumns,
  getColumns,
  reorderColumns,
  updateColumn,
} from "../controller/ColumnController";
import {
  addTask,
  deleteTask,
  editTask,
  getTask,
  reorderTask,
} from "../controller/TaskController";
import {
  addBoard,
  deleteBoard,
  getBoard,
  updateBoard,
} from "../controller/BoardController";

const router = express.Router();

router.post("/user", createUser);

router.post("/user/login/:uid", logInUser);

router.post("/user/:uid/board", addBoard);
router.get("/user/:uid/board", getBoard);
router.delete("/user/:uid/board/:id", deleteBoard);
router.patch("/user/:uid/board/:id", updateBoard);

router.post("/user/:uid/column/:id", addColumn);
router.get("/user/:uid/column/:id", getColumns);
router.delete("/user/:uid/column/:id", deleteColumns);
router.patch("/user/:uid/column/:id", updateColumn);
router.patch("/column/reorder/", reorderColumns);

router.get("/user/:uid/task", getTask);
router.post("/user/:uid/task/:id", addTask);
router.patch("/user/:uid/task/:id", editTask);
router.delete("/user/:uid/task/:id", deleteTask);
router.patch("/task/reorder/", reorderTask);

export default router;

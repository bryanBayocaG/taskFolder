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
import { addTask, getTask } from "../controller/TaskController";

const router = express.Router();

router.post("/user", createUser);

router.post("/user/login/:uid", logInUser);

router.post("/user/:uid/column", addColumn);
router.get("/user/:uid/column", getColumns);
router.delete("/user/:uid/column/:id", deleteColumns);
router.patch("/user/:uid/column/:id", updateColumn);
router.patch("/user/:uid/column/reorder/:activeID/:overID", reorderColumns);

router.get("/user/:uid/task", getTask);
router.post("/user/:uid/task", addTask);
router.patch("/user/:uid/task/:id", updateColumn);
router.delete("/user/:uid/task/:id", deleteColumns);

export default router;

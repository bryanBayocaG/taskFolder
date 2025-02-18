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

const router = express.Router();

router.post("/user", createUser);

router.post("/user/login/:uid", logInUser);

router.post("/user/:uid/column", addColumn);
router.get("/user/:uid/column", getColumns);
router.delete("/user/:uid/column/:id", deleteColumns);
router.patch("/user/:uid/column/:id", updateColumn);

router.patch("/user/:uid/column/reorder/:activeID/:overID", reorderColumns);

export default router;

import express from "express";
import { createUser } from "../controller/UserController";
import { logInUser } from "../controller/auth/authController";
import { addColumn } from "../controller/ColumnController";

const router = express.Router();

router.post("/user", createUser);

router.post("/user/login/:uid", logInUser);

router.post("/user/:uid/column", addColumn);

export default router;

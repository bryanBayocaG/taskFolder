import express from "express";
import { createUser } from "../controller/UserController";
import { logInUser } from "../controller/auth/authController";

const router = express.Router();

router.post("/user", createUser);

router.post("/user/login/:uid", logInUser);

export default router;

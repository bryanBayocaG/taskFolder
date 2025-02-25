import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig";
import webRoute from "./routes/webRoute";
import { Request, Response } from "express";
import Board from "./model/Board.model";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allow JSON request bodies
app.use(
  cors({
    origin: ["http://localhost:5173", "https://task-folder.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", async (req: Request, res: Response) => {
  const boards = await Board.find({ createdBy: "67b2edd34ebaef96de1dd7f6" });
  res.send(boards);
});

app.use("/api/", webRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Running at http://localhost:${PORT}`);
});

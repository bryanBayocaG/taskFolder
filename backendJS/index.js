import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webRoute from "./routes/webRoutes.js";
import connectDB from "./config/dbConfig.js";
import Board from "./model/Board.model.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
// app.use(
//   cors({
//     origin: ["https://task-folder.vercel.app"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );
app.use(cors());

app.get("/", async (req, res) => {
  const boards = await Board.find({ createdBy: "67b2edd34ebaef96de1dd7f6" });
  res.send(boards);
});

app.use("/api/", webRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});

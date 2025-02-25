import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webRoute from "./routes/webRoutes.js";
import connectDB from "./config/dbConfig.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://task-folder.vercel.app"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(cors());

app.get("/", (req, res) => {
  res.send(" task folder api JS");
});

app.use("/api/", webRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});

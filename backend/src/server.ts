import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allow JSON request bodies
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Running at http://localhost:${PORT}`);
});

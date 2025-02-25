import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webRoute from "./routes/webRoutes.js";
import connectDB from "./config/dbConfig.js";

dotenv.config();

const app = express();

// Connect to database
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("Task folder API running on Vercel!");
});

// API Routes
app.use("/api/", webRoute);

// Export app for Vercel
export default app;

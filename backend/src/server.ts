import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig";
import webRoute from "./routes/webRoute";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allow JSON request bodies
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"] /* "*" */, // Allow only frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/", webRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Running at http://localhost:${PORT}`);
});

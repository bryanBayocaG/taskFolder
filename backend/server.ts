import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
// Enable CORS for all origins
app.use(cors());

// OR: Allow specific origins
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow only frontend origin
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(express.json()); // Allow JSON request bodies

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server ready, baby! 🚀");
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});

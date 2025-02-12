import express from "express";

const app = express();
app.listen(5000, () => {
  console.log("Running at http://localhost:5000");
});

app.get("/hatdog", (req, res) => {
  res.send("server ready baby");
});

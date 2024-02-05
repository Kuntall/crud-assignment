import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const port = process.env.PORT || 8001;

// CORS Policy
app.use(cors());

// Database Connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Load Routes

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

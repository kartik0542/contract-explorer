import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import pageRoutes from "./routes/pageRoutes.js";
import contractRoutes from "./routes/contractsRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pages", pageRoutes);
app.use("/api/contracts", contractRoutes);

app.get("/", (req, res) => {
  res.send("Server chal raha hai");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

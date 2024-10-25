import express from "express";
import cors from "cors";
import mongoDB from "./src/database/db.js"; // Adjust to ES module import
import userRoutes from "./src/routes/user.router.js"; // Adjust to ES module import
import { config as configDotenv } from "dotenv"; // Use ES module import for dotenv

// Load environment variables
configDotenv();

const app = express();
const port = process.env.PORT || 5000;

// Initialize MongoDB
mongoDB();

// Use CORS with specific configuration
app.use(cors({ origin: "http://localhost:5173" }));

// Define root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use("/api/user", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

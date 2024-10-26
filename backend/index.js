import express from "express";
import cors from "cors";
import mongoDB from "./src/database/db.js"; // Adjust to ES module import
import userRoutes from "./src/routes/user.router.js"; // Adjust to ES module import
import { config as configDotenv } from "dotenv"; // Use ES module import for dotenv
import cookieParser from "cookie-parser";
import communityPostRouter from './src/routes/communityPost.routes.js'; // Import communityPostRouter

// Load environment variables
configDotenv();

const app = express();
const port = process.env.PORT || 5000;

// Initialize MongoDB
mongoDB();

// Use CORS with specific configuration
app.use(cors({ origin: "http://localhost:5173" , credentials:true}));

// Define root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser()); 

// Use routes
app.use("/api/user", userRoutes);
app.use('/api/community-posts', communityPostRouter); // Use communityPostRouter

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Adjusted log message
});

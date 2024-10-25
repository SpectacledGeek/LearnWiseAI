import express from "express";
import cors from "cors";
import mongoDB from "./src/database/db.js"; // Adjust to ES module import
import createUserRoutes from "./src/models/user.model.js" // Adjust to ES module import

const app = express();
const port = 5000;

// Initialize MongoDB
mongoDB();

// Use CORS with specific configuration
app.use(cors({ origin: 'http://localhost:5173' }));

// Define root route
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api', createUserRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

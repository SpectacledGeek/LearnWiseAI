import express from "express";
import cors from "cors"; // Import cors package

const app = express();

// Default configuration: allows all origins
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

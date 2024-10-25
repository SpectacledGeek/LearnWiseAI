import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js"; // Custom error class

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "diucrghzf",
  api_key: "876229891194841",
  api_secret: "FjVYAKFUEqAMKuMpLmdDkEZn9b4",
  // secure: true, // Ensure HTTPS for secure transfers
});

// Upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new ApiError(400, "No file path provided for upload.");
  }

  try {
    console.log("yaha pahuncha");
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Auto-detect file type (image, video, etc.)
      use_filename: true, // Use the original file name
      unique_filename: false, // Avoid adding unique strings to the file name
    });

    console.log("finally");

    if (!response.url) {
      throw new ApiError(
        500,
        "Upload succeeded but no URL returned from Cloudinary."
      );
    }

    // Log the URL of the uploaded file
    console.log("File uploaded to Cloudinary URL:", response.url);

    // Delete the local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Ensure local file is deleted in case of an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload error:", error.message || error);
    throw new ApiError(500, "Error uploading file to Cloudinary.");
  }
};

export { uploadOnCloudinary };

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const protect = async (req, res, next) => {
  let token;

  // Check if token is in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract token
  }

  // If no token in header, check if it's in cookies
  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken; // Get token from cookies
  }

  if (!token) {
    return res.status(401).json(new ApiError(401, "No token provided"));
  }

  try {
    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -refreshToken");

    // Check if user exists
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }

    next(); // If everything is fine, move to the next middleware
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }
};

const verifyJWT = asyncHandler(async (req, _, next) => {
  console.log("Incoming Request Headers:", req.headers);
  console.log("Cookies:", req.cookies);

  // Get token from Authorization header or cookies
  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.cookies?.accessToken;

  console.log("Token from Header:", req.headers.authorization);
  console.log("Token from Cookie:", req.cookies?.accessToken);
  console.log("Extracted Token:", token);

  // If token is not present, throw error
  if (!token) {
    console.error("Token is missing");
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  try {
    // Secret key for JWT verification
    const secret = process.env.ACCESS_TOKEN_SECRET;

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, secret);
    console.log("Decoded Token ID:", decodedToken?.id);

    // Find user from the decoded token ID
    const user = await User.findById(decodedToken?.id).select("-password -refreshToken");

    if (!user) {
      console.error("No user found for token ID:", decodedToken?.id);
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user data to the request object for further use
    req.user = user;

    // Proceed to next middleware
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    // Provide more context on the error
    throw new ApiError(401, "Invalid or expired token");
  }
});

export default verifyJWT;

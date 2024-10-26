import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  {User}  from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Token Generation Helper
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens");
  }
};
// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields (name, email, password) are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(409, "User with this email already exists");
  }

  let avatarUrl = "";
  if (req.files?.avatar?.[0]) {
    const avatarUpload = await uploadOnCloudinary(req.files.avatar[0].path);
    if (!avatarUpload) throw new ApiError(400, "Avatar upload failed");
    avatarUrl = avatarUpload.url;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatarUrl,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(404, "User registration failed");

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!"));
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(200).json({
    user: loggedInUser,
    accessToken,
    refreshToken,
  });
});
// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  const cookieOptions = { httpOnly: true, secure: true };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  // Assuming req.user has already been populated by your auth middleware
  if (!req.user) {
    return res.status(401).json(new ApiResponse(401, null, "User not authenticated"));
  }

  const userName = req.user.name; // Assuming 'name' is a field in your user object
  const userAvatar = req.user.avatar; // Assuming 'avatar' is a field in your user object

  res.status(200).json(new ApiResponse(200, { name: userName, avatar: userAvatar }, "User fetched successfully"));
});

// Get User by ID
export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select("name avatar email");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ data: user });
});

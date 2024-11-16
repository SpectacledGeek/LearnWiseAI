import { ApiError } from "./ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(new ApiError(err.statusCode, err.message));
  }

  return res.status(500).json(new ApiError(500, "Internal Server Error"));
};

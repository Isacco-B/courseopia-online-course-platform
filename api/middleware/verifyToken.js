import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(errorHandler(401, "Unathorized"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unathorized"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = decoded.UserInfo;
    next();
  });
};

import { errorHandler } from "./errorHandler.js";

export const verifyAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return next(
      errorHandler(403, "Forbidden, Only admins can access this route")
    );
  }
  next();
};

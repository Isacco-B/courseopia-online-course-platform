import { errorHandler } from "./errorHandler.js";

export const verifyIsOwner = (req, res, next) => {
  const { slug, id } = req.user;

  if (
    (req.params.slug && req.params.slug !== slug) ||
    (req.params.userId && req.params.userId !== id)
  ) {
    return next(errorHandler(403, "You are not allowed to access this route"));
  }

  next();
};

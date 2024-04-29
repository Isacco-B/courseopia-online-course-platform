import { rateLimit } from "express-rate-limit";
import { logEvents } from "./logger.js";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message: "Too many login attempts, please try again after 60 seconds",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

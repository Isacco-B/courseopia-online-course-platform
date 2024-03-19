import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/dbConn.js";
import mongoose from "mongoose";
import { logEvents, logger } from "./middleware/logger.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profile_images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
  limits: { fileSize: 1 },
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3000;
dotenv.config();

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import courseRoutes from "./routes/course.routes.js";
import masterRoutes from "./routes/master.routes.js"
import profileRoutes from "./routes/profile.routes.js"

connectDB();

function startServer() {
  const app = express();

  app.use(express.static("public"));

  app.use(logger);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.json("Hello World");
  });

  app.post("/api/upload", upload.single("avatar"), (req, res) => {
    res.json(req.file);
  });

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/lessons", lessonRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/masters", masterRoutes);
  app.use("/api/profile", profileRoutes);

  app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
      res.json({ message: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });

  app.use((err, req, res, next) => {
    logEvents(
      `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res
      .status(statusCode)
      .json({ success: false, statusCode, message, isError: true });
  });

  app.listen(3000, () =>
    console.log(
      "Listening on http://localhost:3000/" +
        "\nApiDoc: http://localhost:3000/api-docs/"
    )
  );
}

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  startServer();
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

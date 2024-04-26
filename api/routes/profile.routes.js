import express from "express";
import multer from "multer";
import path from "path";
import {
  getProfiles,
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyIsOwner } from "../middleware/verifyIsOwner.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { check } from "express-validator";
import { errorHandler } from "../middleware/errorHandler.js";

const router = express.Router();

//Upload Image controller
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "assets/avatars");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const MAX_SIZE = 2 * 1024 * 1024;

//image filter
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, callback) => {
    const filetypes = /jpeg|jpg|png/;
    const mimeType = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback({
      statusCode: 400,
      message:
        "File upload only supports the following filetypes - jpeg, jpg, png",
    });
  },
}).single("avatars");

const isValidDate = (value) => {
  if (!/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)$/.test(value)) {
    throw new Error(
      "Invalid date format. Use YYYY-MM-DDTHH:mm:ss.SSSZ format."
    );
  }
  return true;
};

router.get("", verifyToken, verifyAdmin, getProfiles);
router.get(
  "/:userId",
  verifyToken,
  verifyIsOwner,
  [check("userId").isMongoId().withMessage("Invalid ID")],
  getProfile
);
router.put(
  "/:userId",
  verifyToken,
  verifyIsOwner,
  [
    check("userId").isMongoId().withMessage("Invalid ID"),
    check("phoneNumber")
      .optional()
      .isString()
      .withMessage("Phone number must be a string")
      .isLength({ max: 13 })
      .withMessage("Phone number must be at most 12 characters long")
      .trim(),
    check("dateOfBirth")
      .optional()
      .custom(isValidDate)
      .withMessage("Date of birth must be a valid date"),
    check("gender")
      .optional()
      .isString()
      .withMessage("Gender must be a string")
      .isIn(["male", "female", "other"])
      .withMessage(
        "Gender must be one of the following: 'male', 'female', 'other'"
      )
      .trim(),
    check("city")
      .optional()
      .escape()
      .isString()
      .withMessage("City must be a string")
      .trim(),
    check("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .trim(),
    check("isWorking")
      .optional()
      .isBoolean()
      .withMessage("Is working must be a boolean"),
    check("lookingForJob")
      .optional()
      .isBoolean()
      .withMessage("Looking for job must be a boolean"),
    check("remoteWork")
      .optional()
      .isBoolean()
      .withMessage("Remote work must be a boolean"),
    check("availability")
      .optional()
      .isString()
      .withMessage("Availability must be a string")
      .isIn(["full time", "part time"])
      .withMessage(
        "Availability must be one of the following: 'full time', 'part time'"
      ),
    check("education")
      .optional()
      .isString()
      .withMessage("Education must be a string")
      .isIn([
        "Licenza media",
        "Diploma di scuola superiore",
        "Laurea",
        "Laurea magistrale",
        "Master universitario",
        "Dottorato di ricerca",
      ])
      .withMessage(
        "Education must be one of the following: 'high school', 'bachelor', 'master', 'doctorate'"
      ),
    check("graduationDate")
      .optional()
      .custom(isValidDate)
      .withMessage("Date of birth must be a valid date"),
    check("instagram")
      .optional()
      .if((value, { req }) => req.body.instagram !== "")
      .isURL()
      .isString()
      .withMessage("Instagram must be a string")
      .trim(),
    check("facebook")
      .optional()
      .if((value, { req }) => req.body.facebook !== "")
      .isURL()
      .isString()
      .withMessage("Facebook must be a string")
      .trim(),
    check("linkedin")
      .optional()
      .if((value, { req }) => req.body.linkedin !== "")
      .isURL()
      .isString()
      .withMessage("Linkedin must be a string")
      .trim(),
    check("twitter")
      .optional()
      .if((value, { req }) => req.body.twitter !== "")
      .isURL()
      .isString()
      .withMessage("Twitter must be a string")
      .trim(),
    check("github")
      .optional()
      .if((value, { req }) => req.body.github !== "")
      .isURL()
      .isString()
      .withMessage("Github must be a string")
      .trim(),
    check("website")
      .optional()
      .if((value, { req }) => req.body.website !== "")
      .isURL()
      .isString()
      .withMessage("Website must be a string")
      .trim(),
  ],
  updateProfile
);

router.put(
  "/:userId/image",
  check("userId").isMongoId().withMessage("User id must be a mongo id"),
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return next(errorHandler(400, err.message));
      } else if (err) {
        return next(err);
      }
      next();
    });
  },
  updateProfileImage
);

export default router;

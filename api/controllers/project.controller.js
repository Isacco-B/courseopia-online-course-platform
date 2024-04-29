import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { validationResult } from "express-validator";
import { sendCorrectProjectEmail } from "../utils/emailTemplates/correctProjectEmail.js";

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("createdBy")
      .populate("correctedBy")
      .populate("course")
      .exec();
    if (!projects) {
      return next(errorHandler(404, "Projects not found"));
    }
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { createdBy, course } = req.body;
    const projectData = {
      createdBy,
      course,
    };
    if (req.file) {
      const filePath = `${req?.file?.fieldname}/${req?.file?.filename}`;
      projectData.file = filePath;
    }
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    res.status(201).json({
      message: "Project created successfully",
      savedProject: savedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId } = req.params;
    const { isPassed, description, projectPoints, correctedBy, isCorrect } =
      req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          isPassed,
          description,
          projectPoints,
          correctedBy,
          isCorrect,
        },
      },
      { new: true }
    );

    if (!updatedProject) {
      return next(errorHandler(404, "Project not found"));
    }
    const updatedUser = await User.findByIdAndUpdate(updatedProject.createdBy);

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    if (updatedProject.isPassed) {
      updatedUser.totalPoints += updatedProject.projectPoints;
      updatedUser.coursesCompleted.push(updatedProject.course);
      await updatedUser.save();
    }

    await sendCorrectProjectEmail(updatedUser.email, updatedUser.firstName);

    res.status(200).json({
      message: "Project updated successfully",
      updatedProject: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

import Master from "../models/master.model.js";
import { errorHandler } from "../middleware/errorHandler.js";

export const getMasters = async (req, res, next) => {
  try {
    const masters = await Master.find();
    res.json(masters);
  } catch (error) {
    next(error);
  }
};

export const createMaster = async (req, res, next) => {
  try {
    const newMaster = new Master({
      title: req.body.title,
      description: req.body.description,
      courses: req.body.courses,
      duration: req.body.duration,
    });
    const savedMaster = await newMaster.save();
    res.status(201).json({
      message: "Master created successfully",
      savedMaster: savedMaster,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaster = async (req, res, next) => {
  try {
    const updatedMaster = await Master.findByIdAndUpdate(
      req.params.masterId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          courses: req.body.courses,
          duration: req.body.duration,
        },
      },
      { new: true }
    );
    if (!updatedMaster) {
      return errorHandler(404, "Master not found");
    }
    res.status(200).json({
      message: "Master updated successfully",
      updatedMaster: updatedMaster,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaster = async (req, res, next) => {
  try {
    const deletedMaster = await Master.findByIdAndDelete(req.params.masterId);
    if (!deletedMaster) {
      return errorHandler(404, "Master not found");
    }
    res.status(200).json({
      message: "Master deleted successfully",
      deletedMaster: deletedMaster,
    });
  } catch (error) {
    next(error);
  }
};

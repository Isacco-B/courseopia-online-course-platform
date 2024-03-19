import express from "express";
import {
  getMasters,
  createMaster,
  updateMaster,
  deleteMaster,
} from "../controllers/master.controller.js";

const router = express.Router();

router.get("", getMasters);
router.post("", createMaster);
router.put("/:masterId", updateMaster);
router.delete("/:masterId", deleteMaster);

export default router;

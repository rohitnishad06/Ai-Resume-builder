const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  createResume,
  updateResume,
  deleteResume,
  getResumeById,
  getPublicResumeById,
} = require("../controllers/resumeController");
const upload = require("../configs/multer");

resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", upload.single("image"), updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);

module.exports = resumeRouter;

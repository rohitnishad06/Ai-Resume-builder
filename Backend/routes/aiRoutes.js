const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  enhaceProfessionalSummary,
  enhanceJobDescripion,
  uploadResume,
} = require("../controllers/aiController");

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhaceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescripion);
aiRouter.post("/upload-resume", protect, uploadResume);

module.exports = aiRouter;

import express from "express";
import { getExperiences, addExperience, deleteExperience,updateExperience } from "../controllers/ExperienceController.js";
import { protect } from "../middleware/authMiddleware.js"; 
import upload from "../middleware/multer.js";

const experienceRouter = express.Router();

experienceRouter.get("/", getExperiences);
experienceRouter.post("/", protect, upload.single("image"), addExperience);
experienceRouter.delete("/:id", protect, deleteExperience);
experienceRouter.put("/:id", protect, upload.single("image"), updateExperience);
export default experienceRouter;

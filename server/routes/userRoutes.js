import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createUser,
  getUserData,
  loginUser,
  logoutUser,
  storeRecentSearchedCities,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import {
  updateProfile,
  changePassword,
} from "../controllers/profileController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);
userRouter.put("/profile", protect, upload.single("image"), updateProfile);
userRouter.put("/change-password", protect, changePassword);

export default userRouter;

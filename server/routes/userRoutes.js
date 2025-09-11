import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createUser, getUserData, loginUser, logoutUser, storeRecentSearchedCities } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',createUser);
userRouter.post('/login',loginUser);
userRouter.post('/logout',logoutUser);
userRouter.get('/',protect,getUserData);
userRouter.post('/store-recent-search',protect,storeRecentSearchedCities);


export default userRouter;
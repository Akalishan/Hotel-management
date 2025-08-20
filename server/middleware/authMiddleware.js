import User from "../models/User.js";

//middleware to check if user is authenticated

export const protect = async (req, res, next) => {
  const { userID } = req.auth;
  if (!userID) {
    res.json({ success: false, message: "not authenticaed" });
  } else {
    const user = await User.findById(userID);
    req.user = user;
    next(); 
  }
};

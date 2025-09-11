import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const protect = (req, res, next) => {
  try {
    
    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = {
      _id: tokenDecoded.id,
      username: tokenDecoded.username,

    };

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Token not active yet.",
      });
    }

    // Generic error
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

export { protect};

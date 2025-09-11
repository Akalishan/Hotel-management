import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const generateJwtToken = (userId, username) => {
  if (!userId || !username) {
    throw new Error("userId and username are required");
  }

  if (typeof username !== "string") {
    throw new Error("username must be a string");
  }

  try {
    return jwt.sign(
      {
        id: userId,
        username: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    console.error("JWT generation failed:", error);
    throw new Error("Token generation failed");
  }
};

export default generateJwtToken;

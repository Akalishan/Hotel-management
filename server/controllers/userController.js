import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/JWTTokenGenerate.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";
import Newsletter from "../models/NewsLetter.js";

//api to create the account
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the fields" });
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const existingUser = await User.findOne({ username }, { email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username already taken"
            : "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const firstLetter = username.charAt(0).toUpperCase();
    const defaultAvatar = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=128`;

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      image: defaultAvatar,
    });

    const token = generateToken(user._id, user.username);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    return res.json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        Image: user.image,
        role: user.role,
        recentSearchCities: user.recentSearchCities || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to login the user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid user" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user._id, user.username);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    return res.json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        recentSearchCities: user.recentSearchCities || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//api/user/logout
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//get/api/user/

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username email phone image dateOfBirth address NIC role recentSearchCities"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
      recentSearchCities: user.recentSearchCities || [],
      email: user.email,
      phone: user.phone,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      NIC: user.NIC,
    };
    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//recent search cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    if (!recentSearchedCity) {
      return res
        .status(400)
        .json({ success: false, message: "City is required" });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({
      success: true,
      message: "city added",
      recentSearchCities: user.recentSearchedCities,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // valid for 10 min
    await user.save();

    // Reset URL
    const resetUrl = `${
      req.headers.origin || "http://localhost:5173"
    }/reset-password/${resetToken}`;

    // Send email (configure transporter)
    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS 
    ) {
      console.error("Email configuration missing");
      return res.status(500).json({
        success: false,
        message: "Email service not configured. Please contact support.",
      });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
             <p>This link will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// POST /api/user/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character",
      });
    }
    // Hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to subscribe newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.create({ email });
    res.json({ success: true, message: "Subscribed!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

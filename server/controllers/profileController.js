import bcrypt from "bcrypt";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, phone, dateOfBirth, address, NIC } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.json({ success: false, message: "Email already in use" });
      }
    }

    // Check if username is being changed and if it's already in use
    if (username !== user.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.json({ success: false, message: "Username already taken" });
      }
    }
    // Handle profile image upload if a file is present
    let imageUrl = user.image;
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
        public_id: `user_${userId}`,
        overwrite: true,
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      imageUrl = result.secure_url;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        email: email || user.email,
        phone: phone || user.phone,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
        address: address || user.address,
        NIC: NIC || user.NIC,
        image: imageUrl,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: Date.now(),
    });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { updateProfile, changePassword };

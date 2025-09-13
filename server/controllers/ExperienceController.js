import Experience from "../models/Experience.js";
import cloudinary from "../config/cloudinary.js";

// Get all experiences
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json({ success: true, data: experiences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a new experience
export const addExperience = async (req, res) => {
  try {
    const { title, description, location, price } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "experiences",
      });
      imageUrl = result.secure_url;
    }

    const newExperience = new Experience({
      title,
      description,
      location,
      price,
      image: imageUrl,
      createdBy: req.user?._id,
    });

    await newExperience.save();
    res.json({ success: true, data: newExperience });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.json({ success: true, message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update an experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, price } = req.body;
    let updateData = { title, description, location, price };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "experiences",
      });
      updateData.image = result.secure_url;
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedExperience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.json({ success: true, data: updatedExperience });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

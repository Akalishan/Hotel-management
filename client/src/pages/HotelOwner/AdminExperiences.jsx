import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AdminExperiences = () => {
  const { axios } = useAppContext();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    imageFile: null,
    imagePreview: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all experiences
  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/experiences");
      if (res.data.success) {
        setExperiences(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load experiences");
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
      toast.error(err.response?.data?.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setForm({
        ...form,
        imageFile: file,
        imagePreview: previewUrl,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      price: "",
      imageFile: null,
      imagePreview: "",
    });
    setEditId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clean up preview URL to prevent memory leaks
    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (!editId && !form.imageFile) {
      toast.error("Please select an image for new experiences");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("location", form.location.trim());
      formData.append("price", form.price);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      let res;
      if (editId) {
        res = await axios.put(`/api/experiences/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/experiences", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(
          editId
            ? "Experience updated successfully"
            : "Experience added successfully"
        );
        resetForm();
        fetchExperiences();
      } else {
        toast.error(res.data.message || "Error saving experience");
      }
    } catch (err) {
      console.error("Error saving experience:", err);
      toast.error(err.response?.data?.message || "Error saving experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this experience? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await axios.delete(`/api/experiences/${id}`);
      if (res.data.success) {
        toast.success("Experience deleted successfully");
        fetchExperiences();
      } else {
        toast.error(res.data.message || "Error deleting experience");
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
      toast.error(err.response?.data?.message || "Error deleting experience");
    }
  };

  const handleEdit = (exp) => {
    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setEditId(exp._id);
    setForm({
      title: exp.title,
      description: exp.description,
      location: exp.location || "",
      price: exp.price || "",
      imageFile: null,
      imagePreview: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="pt-2 px-6 md:px-16 lg:px-24 xl:px-32 ">
      <h1 className="text-3xl font-bold mb-8">Manage Experiences</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Experience" : "Add New Experience"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Experience Title *"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Experience Description *"
          rows="4"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={submitting}
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (USD)"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />

        <div>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
          <p className="text-sm text-gray-500 mt-1">
            {editId ? "Leave empty to keep current image. " : ""}
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>

        {/* Image Preview */}
        {form.imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Image Preview:
            </p>
            <img
              src={form.imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Saving..."
              : editId
              ? "Update Experience"
              : "Add Experience"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={submitting}
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Experience List */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          All Experiences ({experiences.length})
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No experiences found. Add your first experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {exp.image && (
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{exp.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                    {exp.description}
                  </p>
                  {exp.location && (
                    <p className="text-gray-500 text-sm mb-2">
                      📍 {exp.location}
                    </p>
                  )}
                  {exp.price && (
                    <p className="text-lg font-bold text-green-600 mb-3">
                      ${parseFloat(exp.price).toFixed(2)}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExperiences;

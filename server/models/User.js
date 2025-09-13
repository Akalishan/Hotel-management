import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default: function () {
        // Use first letter of username as avatar placeholder
        const firstLetter = this.username
          ? this.username.charAt(0).toUpperCase()
          : "U";
        return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=128`;
      },
    },
    role: { type: String, enum: ["hotelOwner", "user"], default: "user" },
    recentSearchCities: [{ type: String, required: true }],
    NIC: { type: String, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    pincode: { type: String, trim: true },

    // ✅ Store classes as array of strings
    classes: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);

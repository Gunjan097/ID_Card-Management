import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String },
  photo: { type: String, required: true }, // Cloudinary URL
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});

export default mongoose.model("Student", studentSchema);

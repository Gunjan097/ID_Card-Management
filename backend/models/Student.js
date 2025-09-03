import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },

    // Basic Info
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, trim: true },
    className: { type: String, required: true, trim: true }, // ✅ String now
    gender: { type: String, enum: ["Male", "Female", "Other"], trim: true },
    dob: { type: Date },
    phone1: { type: String, trim: true },
    phone2: { type: String, trim: true },
    // Extended Info
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    aadharNumber: { type: String, trim: true, unique:true },
    uniqueId: { type: String, trim: true, unique:true },
    grNo: { type: String, trim: true, unique:true },
    rfidNo: { type: String, trim: true, unique:true },

    // Photo
    photo: { type: String, trim: true }, // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

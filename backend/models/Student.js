import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    rollNo: { type: String, trim: true },
    uniqueId: { type: String, unique: true, required: true },
    grNo: { type: String, trim: true },
    rfidNo: { type: String, trim: true },
    aadharNo: { type: String, trim: true },

    className: { type: String, required: true }, // must exist in school's Class list

    phone1: { type: String },
    phone2: { type: String },
    dob: { type: Date },
    bloodGroup: { type: String },
    address: { type: String },

    photo: { type: String },

    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    photo: { type: String }, // Image URL or filename
    address: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);

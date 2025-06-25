import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: { type: String, required: true },
    section: { type: String, required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }
}, { timestamps: true });

export default mongoose.model("Class", classSchema);

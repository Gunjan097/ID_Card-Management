import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },
    className: {
        type: String,
        required: [true, "Class name is required"]
    },
    section: {
        type: String,
        required: [true, "Section is required"]
    },
    classTeacher: {
        type: String,
        required: [true, "Class teacher is required"]
    }
}, { timestamps: true });

export default mongoose.model("Class", classSchema);

import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate class names per school (case-insensitive)
classSchema.index({ className: 1, school: 1 }, { unique: true });

export default mongoose.model("Class", classSchema);

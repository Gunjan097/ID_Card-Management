import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
    permissions: {
        manageSchools: { type: Boolean, default: false },
        exportData: { type: Boolean, default: false }
    }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);

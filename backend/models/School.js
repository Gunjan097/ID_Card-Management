import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: [true, "School name is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("School", schoolSchema);

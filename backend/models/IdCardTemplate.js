import mongoose from "mongoose";

const idCardTemplateSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: [true, "Template name is required"]
    },
    templatePreview: {  // Image URL for preview
        type: String,
        required: [true, "Template preview image is required"]
    },
    fieldsIncluded: [{  // Example: [ "Name", "Photo", "DOB" ]
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("IdCardTemplate", idCardTemplateSchema);

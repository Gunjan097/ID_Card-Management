// Import multer to handle file uploads (like images, CSVs, etc.)
import multer from "multer";

// Import custom storage config for Cloudinary
import { storage } from "../config/cloudinary.js"; // cloudinary-based storage engine

// Create a multer instance using the Cloudinary storage engine
const upload = multer({ storage });

// Export the configured multer middleware
export { upload };

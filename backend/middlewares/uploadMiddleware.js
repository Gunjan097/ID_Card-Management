import multer from "multer";
import { storage } from "../config/cloudinary.js"; // cloudinary-based storage

const upload = multer({ storage });

export { upload };


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create upload folder if not exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // Define storage config
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename(req, file, cb) {
//         const ext = path.extname(file.originalname);
//         cb(null, `${Date.now()}-${file.fieldname}${ext}`);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     // Accept only image files
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Not an image!"), false);
//     }
// };

// export const upload = multer({ storage, fileFilter });

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("Cloudinary configured successfully.");
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'student-photos', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 400, crop: 'limit' }],
  },
});

export { cloudinaryConfig, cloudinary, storage };
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import AppError from '../utils/Error.js';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const customValdation = {
    images: ["image/png", "image/gif", "image/jpeg"]
};
// Function to create a Multer upload middleware with Cloudinary
const upload = (validation, folderName) => {
    // Set up Cloudinary storage
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2,
        params: {
            folder: folderName, // Specify the folder in Cloudinary
            allowed_formats: validation.map(format => format.split('/')[1]) // Extract format from MIME type
        }
    });

    // Set up Multer with Cloudinary storage
    const multerUpload = multer({ storage });

    return (req, res, next) => {
        multerUpload.single('image')(req, res, (err) => {
            if (err) {
                console.error("Upload error:", err);
                return next(new AppError("Failed to upload file", 500));
            }

            if (!req.file) {
                return next(new AppError("No file uploaded", 400));
            }

            // File uploaded successfully, proceed to next middleware
            next();
        });
    };
};

export default upload;
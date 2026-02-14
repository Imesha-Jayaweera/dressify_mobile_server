import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request } from 'express';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export { cloudinary };
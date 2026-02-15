import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request } from 'express';

cloudinary.config({
    cloud_name:'deuo2qq5h',
    api_key:'886493164474484',
    api_secret:'GxNIasqfubusfyTCRuocousvGV8'
});

// ✅ Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
        console.log(`📤 Uploading file: ${file.originalname}`);
        return {
            folder: 'dressify/products',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' }
            ],
            public_id: `product-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        };
    },
});

// ✅ Create multer upload middleware with better error handling
export const uploadToCloudinary = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 10, // Max 10 files
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        console.log(`🔍 Checking file: ${file.originalname}, mimetype: ${file.mimetype}`);

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed.`));
        }
    },
});

// ✅ Middleware for multiple product images with error handling
export const uploadProductImages = (req: any, res: any, next: any) => {

    const upload = uploadToCloudinary.array('images', 10);

    upload(req, res, (err: any) => {
        if (err) {
            console.error('❌ Multer error:', err);

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File too large. Maximum size is 10MB.'
                    });
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files. Maximum is 10 files.'
                    });
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        success: false,
                        message: 'Unexpected field name. Use "images" for file uploads.'
                    });
                }
            }

            return res.status(400).json({
                success: false,
                message: err.message || 'Error uploading files'
            });
        }

        console.log(`✅ Files uploaded successfully: ${req.files?.length || 0} files`);
        next();
    });
};

// ✅ Helper function to delete images from Cloudinary
export const deleteImageFromCloudinary = async (imageUrl: string): Promise<boolean> => {
    try {
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const fullPublicId = `${folder}/${publicId}`;

        const result = await cloudinary.uploader.destroy(fullPublicId);
        console.log('🗑️ Cloudinary delete result:', result);
        return result.result === 'ok';
    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
        return false;
    }
};

export default cloudinary;
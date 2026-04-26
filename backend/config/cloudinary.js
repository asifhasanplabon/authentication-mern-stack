import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloude_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

export const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'jkkniu_lms/students',
        allowed_formats:['jpg','png','jpeg'],
        transformation:[{
            width:400,
            height: 400,
            crops:'fill'
        }],
    },
});

export default cloudinary;
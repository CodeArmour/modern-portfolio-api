/**
 * middleware/upload.ts
 */
import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});
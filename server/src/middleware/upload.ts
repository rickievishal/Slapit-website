import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { AppError } from './errorHandler';

// Storage abstraction interface - can be swapped for Cloudinary/S3
export interface IStorageProvider {
  upload(file: Express.Multer.File): Promise<string>;
  delete(url: string): Promise<void>;
}

// Local storage implementation
export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;
  private baseUrl: string;

  constructor(uploadDir: string = 'uploads', baseUrl: string = '/uploads') {
    this.uploadDir = path.resolve(__dirname, '../../', uploadDir);
    this.baseUrl = baseUrl;

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    return `${this.baseUrl}/${file.filename}`;
  }

  async delete(url: string): Promise<void> {
    const filename = url.replace(`${this.baseUrl}/`, '');
    const filepath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpg, jpeg, png, webp) are allowed', 400) as any);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const storageProvider = new LocalStorageProvider();

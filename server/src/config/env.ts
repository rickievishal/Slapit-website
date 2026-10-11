import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/slapit',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

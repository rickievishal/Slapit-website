import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/slapit',
  SITE_URL: process.env.SITE_URL || 'https://slapitposters.itsmevishal.in',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
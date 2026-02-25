import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL: {
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY,
    FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
    FROM_NAME: process.env.MAIL_FROM_NAME
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SEED_DEFAULT_ADMIN: process.env.SEED_DEFAULT_ADMIN === 'true'
};

// Validate required environment variables in production
if (config.NODE_ENV === 'production') {
  const required = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
  }
}
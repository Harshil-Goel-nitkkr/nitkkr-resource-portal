import dotenv from 'dotenv';
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

console.log(process.env.EMAIL_USER);

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
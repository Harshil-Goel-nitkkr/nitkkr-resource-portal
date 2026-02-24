import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/serverConfig.js';
import { Admin } from './models/Admin.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import seniorRoutes from './routes/seniorRoutes.js';
import contributionRoutes from './routes/contributionRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

// Serve static files in production
app.use(express.static(path.join(__dirname, '../dist')));

// DB Connection
mongoose.connect(config.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    // Seed default admin only in development when enabled
    if (config.SEED_DEFAULT_ADMIN && config.NODE_ENV === 'development') {
      try {
        const adminExists = await Admin.findOne({ email: 'admin@nitkkr.com' });
        if (!adminExists) {
          const admin = new Admin({
            email: 'admin@nitkkr.com',
            password: 'admin123', // Will be hashed by pre-save hook
            name: 'Super Admin'
          });
          await admin.save();
          console.log('Default Admin Account Created: admin@nitkkr.com / admin123');
        }
      } catch (err) {
        console.error('Admin Seed Error:', err);
      }
    }
  })
  .catch(err => console.error('DB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/seniors', seniorRoutes);
app.use('/api/contributions', contributionRoutes);

// Serve React app for all non-API routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
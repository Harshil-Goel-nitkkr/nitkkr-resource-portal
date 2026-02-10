import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/serverConfig.js';
import { Admin } from './models/Admin.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import seniorRoutes from './routes/seniorRoutes.js';
import contributionRoutes from './routes/contributionRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

// DB Connection
mongoose.connect(config.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    // Seed default admin if not exists
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
  })
  .catch(err => console.error('DB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/seniors', seniorRoutes);
app.use('/api/contributions', contributionRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
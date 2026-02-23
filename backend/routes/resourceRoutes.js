import express from 'express';
import { getResources, addResource, getAllResources } from '../controllers/resourceController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin access - Get all resources
router.get('/all', verifyToken, isAdmin, getAllResources);

// Public/User access
router.get('/', verifyToken, getResources);

// Admin access
router.post('/', verifyToken, isAdmin, addResource);

export default router;
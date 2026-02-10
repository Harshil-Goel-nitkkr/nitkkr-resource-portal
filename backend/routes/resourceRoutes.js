import express from 'express';
import { getResources, addResource } from '../controllers/resourceController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/User access
router.get('/', verifyToken, getResources);

// Admin access
router.post('/', verifyToken, isAdmin, addResource);

export default router;
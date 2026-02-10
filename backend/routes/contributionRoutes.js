import express from 'express';
import { submitContribution, getContributions, updateStatus } from '../controllers/contributionController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, submitContribution);
router.get('/', verifyToken, isAdmin, getContributions);
router.put('/:id', verifyToken, isAdmin, updateStatus);

export default router;
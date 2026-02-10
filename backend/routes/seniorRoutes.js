import express from 'express';
import { getSeniors, addSenior } from '../controllers/seniorController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getSeniors);
router.post('/', verifyToken, isAdmin, addSenior);

export default router;
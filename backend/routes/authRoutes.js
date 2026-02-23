import express from 'express';
import { sendOtp, verifyOtp, adminLogin, logout, verifyAuth } from '../controllers/authController.js';

const router = express.Router();

router.get('/verify-auth', verifyAuth);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);

export default router;
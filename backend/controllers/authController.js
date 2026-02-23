import * as authService from '../services/authService.js';
import { config } from '../config/serverConfig.js';

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email.endsWith('@nitkkr.ac.in')) {
      return res.status(400).json({ message: 'Invalid domain. Use @nitkkr.ac.in' });
    }
    await authService.sendStudentOtp(email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, rememberMe } = req.body;
    const token = await authService.verifyStudentOtp(email, otp, rememberMe);
    
    setTokenCookie(res, token, rememberMe);
    res.status(200).json({ message: 'Login successful', user: { email, role: 'student' } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginAdmin(email, password);
    
    setTokenCookie(res, token, false);
    res.status(200).json({ message: 'Admin login successful', user: { email, role: 'admin' } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const verifyAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }
    const user = await authService.verifyToken(token);
    res.status(200).json({ message: 'Token valid', user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const logout = (req, res) => {
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax'
  };
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: 'Logged out' });
};

const setTokenCookie = (res, token, rememberMe) => {
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  };
  res.cookie('token', token, cookieOptions);
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { config } from '../config/serverConfig.js';
import * as userRepository from '../repository/userRepository.js';
import * as adminRepository from '../repository/adminRepository.js';

const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();


// ================= SEND STUDENT OTP =================
export const sendStudentOtp = async (email) => {

  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60000);

  await userRepository.createUserOrUpdateOtp(email, hashedOtp, expiresAt);

  // DEV MODE
  if (config.NODE_ENV === 'development') {
    console.log(`DEV MODE OTP for ${email}: ${otp}`);
    return true;
  }

  // ================= SEND MAIL VIA API =================
  try {

   const messageId = `otp_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

const response = await axios.post(
  'https://mailserver.automationlounge.com/api/v1/messages/send',
  {
    messageId: messageId,   //REQUIRED FIELD
    to: email,
    subject: 'Your Login OTP',
    html: `
      <h3>NIT KKR Resources Login</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `
  },
  {
    headers: {
      Authorization: `Bearer ${config.EMAIL.API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

    console.log("📧 Mail API response:", response.data);

    if (!response.data?.success) {
      throw new Error('Mail API failed to send email');
    }

    return true;

  } catch (error) {

    console.error("❌ Mail send error:", 
      error.response?.data || error.message
    );

    throw new Error('Failed to send OTP email');
  }
};


// ================= VERIFY STUDENT OTP =================
export const verifyStudentOtp = async (email, otp, rememberMe) => {

  const user = await userRepository.findUserByEmail(email);

  if (!user?.otp?.code) throw new Error('OTP not requested');

  if (new Date() > user.otp.expiresAt)
    throw new Error('OTP expired');

  const isValid = await bcrypt.compare(otp, user.otp.code);
  if (!isValid) throw new Error('Invalid OTP');

  await userRepository.clearUserOtp(user._id);

  return generateToken(user, 'student', rememberMe);
};


// ================= ADMIN LOGIN =================
export const loginAdmin = async (email, password) => {

  const admin = await adminRepository.findAdminByEmail(email);
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return generateToken(admin, 'admin', false);
};


// ================= TOKEN =================
const generateToken = (user, role, rememberMe) => {

  return jwt.sign(
    { id: user._id, email: user.email, role },
    config.JWT_SECRET,
    { expiresIn: rememberMe ? '7d' : '1d' }
  );
};


export const verifyToken = (token) => {

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

  } catch {
    throw new Error('Invalid or expired token');
  }
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { config } from '../config/serverConfig.js';
import * as userRepository from '../repository/userRepository.js';
import * as adminRepository from '../repository/adminRepository.js';

// Mail Transporter
let transporter;
try{
  transporter = nodemailer.createTransport({
    host: "smtp.mailersend.net",
    port: 587,
    secure: false,
    auth: { user: config.EMAIL.USER, pass: config.EMAIL.PASS }
  });
}
catch(error){
  console.error('Error creating mail transporter:', error);
  throw new Error('Failed to create mail transporter');
}

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const sendStudentOtp = async (email) => {
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins

  await userRepository.createUserOrUpdateOtp(email, hashedOtp, expiresAt);

  if (config.NODE_ENV === 'development') {
    console.log(`DEV MODE OTP for ${email}: ${otp}`);
  } else {
    try{
      await transporter.sendMail({
        from: `"NIT KKR RESOURCES" <${config.EMAIL.USER}>`,
        to: email,
        subject: 'Your Login OTP',
        text: `Your OTP is ${otp}`
      });
    }catch(error){
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
    
  }
  return true;
};

export const verifyStudentOtp = async (email, otp, rememberMe) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user || !user.otp || !user.otp.code) throw new Error('OTP not requested');
  if (new Date() > user.otp.expiresAt) throw new Error('OTP expired');

  const isValid = await bcrypt.compare(otp, user.otp.code);
  if (!isValid) throw new Error('Invalid OTP');

  await userRepository.clearUserOtp(user._id);
  return generateToken(user, 'student', rememberMe);
};

export const loginAdmin = async (email, password) => {
  const admin = await adminRepository.findAdminByEmail(email);
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return generateToken(admin, 'admin', false);
};

const generateToken = (user, role, rememberMe) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: role },
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
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
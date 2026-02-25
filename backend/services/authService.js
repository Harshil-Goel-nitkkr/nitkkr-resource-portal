import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { config } from '../config/serverConfig.js';
import * as userRepository from '../repository/userRepository.js';
import * as adminRepository from '../repository/adminRepository.js';

// MailerSend client
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const sendStudentOtp = async (email) => {
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60000);

  await userRepository.createUserOrUpdateOtp(email, hashedOtp, expiresAt);

  if (config.NODE_ENV === 'development') {
    console.log(`DEV MODE OTP for ${email}: ${otp}`);
  } else {
    try {
      const sentFrom = new Sender(config.EMAIL.USER, "NIT KKR RESOURCES");
      const recipients = [new Recipient(email)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject("Your Login OTP")
        .setText(`Your OTP is ${otp}`);

      await mailerSend.email.send(emailParams);

    } catch (error) {
      console.error('Error sending OTP email:', error?.body || error);
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
  } catch {
    throw new Error('Invalid or expired token');
  }
};
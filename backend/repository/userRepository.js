import { User } from '../models/User.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUserOrUpdateOtp = async (email, hashedOtp, expiresAt) => {
  return await User.findOneAndUpdate(
    { email },
    { email, otp: { code: hashedOtp, expiresAt } },
    { upsert: true, new: true }
  );
};

export const clearUserOtp = async (userId) => {
  return await User.findByIdAndUpdate(userId, { $unset: { otp: 1 } });
};
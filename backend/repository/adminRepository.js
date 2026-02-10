import { Admin } from '../models/Admin.js';

export const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

export const createAdmin = async (data) => {
  const admin = new Admin(data);
  return await admin.save();
};
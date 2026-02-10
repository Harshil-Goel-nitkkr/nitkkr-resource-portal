import { Senior } from '../models/Senior.js';

export const findSeniors = async (filter) => {
  return await Senior.find(filter);
};

export const createSenior = async (data) => {
  const senior = new Senior(data);
  return await senior.save();
};
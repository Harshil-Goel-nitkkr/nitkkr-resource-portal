import { Contribution } from '../models/Contribution.js';

export const createContribution = async (data) => {
  const contribution = new Contribution(data);
  return await contribution.save();
};

export const getContributionsByStatus = async (status) => {
  const query = status ? { status } : {};
  return await Contribution.find(query).sort({ createdAt: -1 });
};

export const updateContributionStatus = async (id, status) => {
  return await Contribution.findByIdAndUpdate(id, { status }, { new: true });
};
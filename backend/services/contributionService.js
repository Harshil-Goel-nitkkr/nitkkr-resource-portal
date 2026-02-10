import * as contributionRepository from '../repository/contributionRepository.js';

export const submitContribution = async (data, userEmail) => {
  const submission = { ...data, submittedBy: userEmail };
  return await contributionRepository.createContribution(submission);
};

export const getContributions = async (status) => {
  return await contributionRepository.getContributionsByStatus(status);
};

export const reviewContribution = async (id, status) => {
  return await contributionRepository.updateContributionStatus(id, status);
};
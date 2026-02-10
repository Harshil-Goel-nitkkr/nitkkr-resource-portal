import * as seniorRepository from '../repository/seniorRepository.js';

export const getSeniors = async (category, branch) => {
  const filter = {};
  if (category) filter.category = category;
  if (branch) filter.branch = branch;
  
  const data = await seniorRepository.findSeniors(filter);
  return data.length > 0 ? data : null;
};

export const addSenior = async (data) => {
  return await seniorRepository.createSenior(data);
};
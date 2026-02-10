import * as resourceRepository from '../repository/resourceRepository.js';

export const getResources = async (branch, semester) => {
  const data = await resourceRepository.findResourcesByBranchAndSem(branch, semester);
  if (!data || data.length === 0) return null;
  return data;
};

export const addResource = async (data) => {
  return await resourceRepository.createOrUpdateResource(data);
};

export const addResourceItem = async (branch, semester, subjectName, resourceItem) => {
  return await resourceRepository.addMaterialToSubject(branch, semester, subjectName, resourceItem);
};

export const getAll = async () => {
  return await resourceRepository.getAllResources();
};
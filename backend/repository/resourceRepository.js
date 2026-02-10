import { Resource } from '../models/Resource.js';

export const findResourcesByBranchAndSem = async (branch, semester) => {
  return await Resource.find({ branch, semester });
};

export const createOrUpdateResource = async (data) => {
  // If subject exists for branch/sem, update it, else create
  // This overwrites if sent fully, or creates new
  const query = { branch: data.branch, semester: data.semester, subjectName: data.subjectName };
  const update = { $set: data }; 
  return await Resource.findOneAndUpdate(query, update, { upsert: true, new: true });
};

export const addMaterialToSubject = async (branch, semester, subjectName, resourceItem) => {
  return await Resource.findOneAndUpdate(
    { branch, semester, subjectName },
    { $push: { resources: resourceItem } },
    { new: true }
  );
};

export const getAllResources = async () => {
  return await Resource.find({});
};
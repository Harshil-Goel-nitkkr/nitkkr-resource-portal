import * as resourceService from '../services/resourceService.js';

export const getResources = async (req, res) => {
  try {
    const { branch, sem } = req.query;
    if (!branch || !sem) return res.status(400).json({ message: 'Branch and Semester required' });

    const data = await resourceService.getResources(branch, parseInt(sem));
    if (!data) return res.status(200).json({ data: [] }); // Empty array handled by frontend
    
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const data = await resourceService.getAll();
    res.status(200).json({ data: data || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addResource = async (req, res) => {
  try {
    const { action } = req.body;
    
    if (action === 'add_material') {
      // Append to existing subject
      const { branch, semester, subjectName, resource } = req.body;
      if (!branch || !semester || !subjectName || !resource) {
        return res.status(400).json({ message: 'Missing required fields for adding material' });
      }
      const result = await resourceService.addResourceItem(branch, parseInt(semester), subjectName, resource);
      
      if (!result) {
        return res.status(404).json({ message: 'Subject not found. Create the subject first.' });
      }
      return res.status(200).json({ message: 'Material added successfully', data: result });
      
    } else {
      // Create or Overwrite Subject (Default)
      const result = await resourceService.addResource(req.body);
      res.status(201).json({ message: 'Subject created/updated', data: result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
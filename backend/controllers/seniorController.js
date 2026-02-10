import * as seniorService from '../services/seniorService.js';

export const getSeniors = async (req, res) => {
  try {
    const { category, branch } = req.query;
    const data = await seniorService.getSeniors(category, branch);
    if (!data) return res.status(200).json({ data: [] });
    
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSenior = async (req, res) => {
  try {
    const result = await seniorService.addSenior(req.body);
    res.status(201).json({ message: 'Senior profile added', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
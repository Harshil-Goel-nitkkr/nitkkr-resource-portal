import * as contributionService from '../services/contributionService.js';
import * as resourceService from '../services/resourceService.js';

export const submitContribution = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : 'Anonymous';
    await contributionService.submitContribution(req.body, userEmail);
    res.status(201).json({ message: 'Contribution submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContributions = async (req, res) => {
  try {
    const { status } = req.query;
    const data = await contributionService.getContributions(status);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 1. Update status
    const contribution = await contributionService.reviewContribution(id, status);
    
    // 2. Auto-add resource if approved
    if (status === 'approved' && contribution.type === 'resource' && contribution.details) {
      const { branch, semester, subjectName, link } = contribution.details;
      
      // Determine type crudely or default to 'notes'
      const resourceItem = {
        title: contribution.description || 'Contributed Resource',
        type: 'notes', 
        link: link
      };

      // Attempt to add to existing subject
      // If subject doesn't exist, this specific auto-add will be skipped (returns null)
      // Admin can manually add it if needed.
      const result = await resourceService.addResourceItem(branch, semester, subjectName, resourceItem);
      
      if (!result) {
         // Optionally we could create the subject here, but that might require more defaults.
         // For now, we let the admin know via the returned data or they handle manual creation.
         console.log(`Subject ${subjectName} not found for auto-addition.`);
      }
    }

    res.status(200).json({ message: 'Status updated', data: contribution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
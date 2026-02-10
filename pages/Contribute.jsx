import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function Contribute() {
  const [type, setType] = useState('bug');
  const [formData, setFormData] = useState({
    branch: '',
    semester: '1',
    subjectName: '',
    link: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Construct payload based on type
      const payload = {
        type,
        description: formData.description,
        details: type === 'resource' ? {
          branch: formData.branch,
          semester: parseInt(formData.semester),
          subjectName: formData.subjectName,
          link: formData.link
        } : undefined
      };

      await api.post('/contributions', payload);
      setSubmitted(true);
      setFormData({
        branch: '',
        semester: '1',
        subjectName: '',
        link: '',
        description: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Contribute & Report</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {submitted ? (
          <div className="text-center text-green-600 py-10 animate-fade-in">
            <h3 className="text-xl font-bold">Thank You!</h3>
            <p>Your submission has been received and will be reviewed.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-blue-600 underline">Submit another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submission Type</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setType('bug')}
                  className={`flex-1 py-2 px-4 rounded-md border transition-colors ${type === 'bug' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Report Bug
                </button>
                <button
                  type="button"
                  onClick={() => setType('resource')}
                  className={`flex-1 py-2 px-4 rounded-md border transition-colors ${type === 'resource' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Upload Resource
                </button>
              </div>
            </div>

            {type === 'resource' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select branch</option>
                      {['CSE','IT','ECE','EE','ME','Civil','PIE','AIML','AIDS','M&C','IIOT','VLSI','SET','ROBOTICS'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    name="subjectName" 
                    value={formData.subjectName} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md" 
                    required 
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link (Drive/Dropbox)</label>
                    <input 
                      type="url" 
                      name="link" 
                      value={formData.link} 
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md" 
                      placeholder="https://..." 
                      required 
                    />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Message</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md h-32" 
                placeholder={type === 'bug' ? "Describe the issue you faced..." : "Describe the resource content..."}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg transition ${loading ? 'bg-gray-400' : 'bg-nit-primary hover:bg-blue-900'}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
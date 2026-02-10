import React, { useState, useEffect } from 'react';
import { Linkedin, User, Briefcase, Loader } from 'lucide-react';
import { api } from '../services/api.js';

const CATEGORIES = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'PIE', 'AIML','AIDS','M&C', 'IIOT','VLSI','SET','ROBOTICS'];

const SeniorCard = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
    <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700"></div>
    <div className="px-6 relative">
      <img 
        src={data.imageUrl || `https://ui-avatars.com/api/?name=${data.name}&background=random`} 
        alt={data.name} 
        className="w-20 h-20 rounded-full border-4 border-white absolute -top-10 shadow-sm object-cover bg-gray-200" 
      />
    </div>
    <div className="pt-12 pb-6 px-6">
      <h3 className="font-bold text-lg text-gray-800">{data.name}</h3>
      <div className="text-sm text-gray-500 mb-2">{data.branch}</div>
      {data.company && (
        <div className="flex items-center text-sm text-gray-700 mb-4 bg-gray-100 p-2 rounded w-fit">
          <Briefcase className="w-3 h-3 mr-2 text-gray-500" />
          {data.company}
        </div>
      )}
      {data.linkedin && (
        <a 
          href={data.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Connect
        </a>
      )}
    </div>
  </div>
);

export default function Seniors() {
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState('');
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && branch) {
      fetchSeniors();
    } else {
      setSeniors([]);
    }
  }, [category, branch]);

  const fetchSeniors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seniors', { params: { category, branch } });
      setSeniors(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSeniors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Connect with Seniors</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <select 
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Year/Category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select 
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary outline-none"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Loader className="animate-spin text-nit-primary w-8 h-8" /></div>
        ) : category && branch ? (
          seniors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seniors.map(senior => <SeniorCard key={senior._id} data={senior} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-dashed text-gray-500">
               <User className="w-12 h-12 mb-4 text-gray-300" />
               <p className="font-medium">Sorry, we are currently working on it.</p>
               <p className="text-sm">No profiles found for {branch} in {category}.</p>
            </div>
          )
        ) : (
           <div className="flex items-center justify-center h-64 text-gray-400">
             Please select both Category and Branch to view profiles.
           </div>
        )}
      </div>
    </div>
  );
}
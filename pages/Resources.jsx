import React, { useState, useEffect } from 'react';
import { Book, FileText, Video, FolderOpen, Loader } from 'lucide-react';
import { api } from '../services/api.js';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'PIE', 'AIML','AIDS','M&C', 'IIOT','VLSI','SET','ROBOTICS'];
const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

const NoData = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 mt-6">
    <FolderOpen className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-lg font-medium">{message || "Sorry we are currently working on it"}</p>
  </div>
);

export default function Resources() {
  const [branch, setBranch] = useState('');
  const [sem, setSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (branch && sem) {
      fetchResources();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [branch, sem]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources', { params: { branch, sem } });
      setSubjects(res.data.data || []);
      setSelectedSubject(null); // Reset selection on fetch
    } catch (err) {
      console.error(err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to categorize resources for the selected subject
  const getCategorizedResources = (subject) => {
    const categories = {
      lectures: [],
      pdfs: [],
      pyqs: [],
      notes: []
    };
    
    if (!subject || !subject.resources) return categories;

    subject.resources.forEach(res => {
      if (res.type === 'lecture') categories.lectures.push(res);
      else if (res.type === 'pdf') categories.pdfs.push(res);
      else if (res.type === 'pyq') categories.pyqs.push(res);
      else if (res.type === 'notes') categories.notes.push(res);
    });

    return categories;
  };

  const resourceData = selectedSubject ? getCategorizedResources(selectedSubject) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Academic Resources</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nit-primary outline-none"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">-- Choose Branch --</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-nit-primary outline-none"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
          >
            <option value="">-- Choose Semester --</option>
            {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </div>

      {/* Content Area */}
      {branch && sem && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Subject List */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="font-semibold text-gray-700 mb-2">Subjects</h2>
            
            {loading ? (
              <div className="flex justify-center py-10"><Loader className="animate-spin text-nit-primary" /></div>
            ) : subjects.length > 0 ? (
              subjects.map(sub => (
                <div 
                  key={sub._id} 
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedSubject?._id === sub._id ? 'bg-nit-primary text-white shadow-md' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}
                >
                  <div className="font-medium">{sub.subjectName}</div>
                  <div className={`text-xs ${selectedSubject?._id === sub._id ? 'text-blue-200' : 'text-gray-500'}`}>{sub.subjectCode}</div>
                </div>
              ))
            ) : (
              <NoData message="No subjects found. We are working on it." />
            )}
          </div>

          {/* Details Area */}
          <div className="md:col-span-2">
             <h2 className="font-semibold text-gray-700 mb-2">Materials</h2>
             {selectedSubject ? (
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
                 <h3 className="text-xl font-bold text-nit-primary border-b pb-2">{selectedSubject.subjectName} Resources</h3>
                 
                 {/* Lecture Links */}
                 <div>
                   <h4 className="flex items-center text-sm font-bold text-gray-600 mb-3"><Video className="w-4 h-4 mr-2"/> Video Lectures</h4>
                   <div className="space-y-2">
                      {resourceData.lectures.length > 0 ? resourceData.lectures.map((l, i) => (
                        <a key={i} href={l.link} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline text-sm truncate">{l.title}</a>
                      )) : <p className="text-xs text-gray-400 italic">No lectures available</p>}
                   </div>
                 </div>

                 {/* PDFs */}
                 <div>
                   <h4 className="flex items-center text-sm font-bold text-gray-600 mb-3"><Book className="w-4 h-4 mr-2"/> Books & PDFs</h4>
                   <div className="space-y-2">
                      {resourceData.pdfs.length > 0 ? resourceData.pdfs.map((l, i) => (
                        <a key={i} href={l.link} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline text-sm truncate">{l.title}</a>
                      )) : <p className="text-xs text-gray-400 italic">No documents available</p>}
                   </div>
                 </div>

                 {/* PYQs */}
                 <div>
                   <h4 className="flex items-center text-sm font-bold text-gray-600 mb-3"><FileText className="w-4 h-4 mr-2"/> Previous Year Questions</h4>
                   <div className="space-y-2">
                      {resourceData.pyqs.length > 0 ? resourceData.pyqs.map((l, i) => (
                        <a key={i} href={l.link} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline text-sm truncate">{l.title}</a>
                      )) : <p className="text-xs text-gray-400 italic">No PYQs available</p>}
                   </div>
                 </div>

                 {/* Notes */}
                 <div>
                   <h4 className="flex items-center text-sm font-bold text-gray-600 mb-3"><FolderOpen className="w-4 h-4 mr-2"/> Other Notes</h4>
                   <div className="space-y-2">
                      {resourceData.notes.length > 0 ? resourceData.notes.map((l, i) => (
                        <a key={i} href={l.link} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline text-sm truncate">{l.title}</a>
                      )) : <p className="text-xs text-gray-400 italic">No notes available</p>}
                   </div>
                 </div>

               </div>
             ) : (
               <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-xl">
                 Select a subject to view resources
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
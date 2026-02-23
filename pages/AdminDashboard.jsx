import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Plus, 
  Check, 
  X, 
  Loader,
  Trash2,
  FileText
} from 'lucide-react';
import { api, verifyAuth } from '../services/api.js';

// Constants
const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'PIE', 'AIML','AIDS','M&C', 'IIOT','VLSI','SET','ROBOTICS'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const SENIOR_CATEGORIES = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];
const RESOURCE_TYPES = ['lecture', 'pdf', 'pyq', 'notes'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verifyAuth();
        if (!response.data.user || response.data.user.role !== 'admin') {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'resources': return <ResourcesTab />;
      case 'seniors': return <SeniorsTab />;
      case 'contributions': return <ContributionsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 shadow-md z-10 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-nit-primary">Admin Panel</h2>
          <p className="text-xs text-gray-500">NIT KKR Resources</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<BookOpen size={20}/>} label="Manage Resources" id="resources" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<Users size={20}/>} label="Manage Seniors" id="seniors" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<MessageSquare size={20}/>} label="Contributions" id="contributions" active={activeTab} set={setActiveTab} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, id, active, set }) => (
  <button 
    onClick={() => set(id)}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active === id ? 'bg-nit-primary text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

// --- TABS ---

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Visits" value="12,450" color="blue" />
        <StatCard title="Active Resources" value="856" color="green" />
        <StatCard title="Pending Requests" value="12" color="yellow" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-bold text-gray-700 mb-4">System Status</h3>
        <div className="flex items-center text-green-600">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          All Systems Operational
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "border-blue-500 text-blue-600 bg-blue-50",
    green: "border-green-500 text-green-600 bg-green-50",
    yellow: "border-yellow-500 text-yellow-600 bg-yellow-50"
  };
  return (
    <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${colors[color] ? '' : ''}`}>
      <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">{title}</h3>
      <p className={`text-3xl font-extrabold mt-2 ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
};

const ResourcesTab = () => {
  const [mode, setMode] = useState('add_material'); // 'add_material' | 'create_subject'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form State
  const [formData, setFormData] = useState({
    branch: '',
    semester: '1',
    subjectName: '',
    subjectCode: '',
    resourceTitle: '',
    resourceType: 'lecture',
    resourceLink: ''
  });

  const [existingSubjects, setExistingSubjects] = useState([]);

  // Fetch subjects helper
  const fetchSubjects = async () => {
    if (formData.branch && formData.semester) {
      try {
        const res = await api.get('/resources', { params: { branch: formData.branch, sem: formData.semester } });
        setExistingSubjects(res.data.data || []);
      } catch(e) { console.error(e); }
    }
  };

  // Fetch subjects when branch/sem changes in add_material mode
  useEffect(() => {
    if (mode === 'add_material') {
      fetchSubjects();
    }
  }, [mode, formData.branch, formData.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = mode === 'create_subject' 
        ? {
            branch: formData.branch,
            semester: parseInt(formData.semester),
            subjectName: formData.subjectName,
            subjectCode: formData.subjectCode,
            resources: [] // New subject starts empty
          }
        : {
            action: 'add_material',
            branch: formData.branch,
            semester: parseInt(formData.semester),
            subjectName: formData.subjectName,
            resource: {
              title: formData.resourceTitle,
              type: formData.resourceType,
              link: formData.resourceLink
            }
          };

      await api.post('/resources', payload);
      setMessage({ type: 'success', text: mode === 'create_subject' ? 'Subject Created!' : 'Resource Added!' });
      
      // Reset relevant fields
      setFormData(prev => ({ ...prev, resourceTitle: '', resourceLink: '', subjectCode: '' }));
      if (mode === 'create_subject') {
        setFormData(prev => ({ ...prev, subjectName: '' }));
      }
      
      // If we created a subject, and are in create mode, we might want to stay there, 
      // but if we switch tabs, we want the list to update.
      // Refresh list just in case we are displaying it somewhere or planning to switch
      if (formData.branch && formData.semester) {
         fetchSubjects();
      }

    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Resources</h2>
        <div className="flex bg-white rounded-lg shadow-sm p-1 border">
          <button 
            onClick={() => setMode('add_material')}
            className={`px-4 py-2 text-sm rounded-md transition ${mode === 'add_material' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}
          >
            Add Material
          </button>
          <button 
            onClick={() => setMode('create_subject')}
            className={`px-4 py-2 text-sm rounded-md transition ${mode === 'create_subject' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}
          >
            Create Subject
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select 
                required 
                className="w-full p-2 border rounded-md"
                value={formData.branch}
                onChange={e => setFormData({...formData, branch: e.target.value})}
              >
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select 
                required 
                className="w-full p-2 border rounded-md"
                value={formData.semester}
                onChange={e => setFormData({...formData, semester: e.target.value})}
              >
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {mode === 'create_subject' ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input 
                  type="text" required 
                  className="w-full p-2 border rounded-md"
                  value={formData.subjectName}
                  onChange={e => setFormData({...formData, subjectName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code (Optional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={formData.subjectCode}
                  onChange={e => setFormData({...formData, subjectCode: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
               <select 
                  required 
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                  value={formData.subjectName}
                  onChange={e => setFormData({...formData, subjectName: e.target.value})}
                  disabled={!formData.branch}
               >
                 <option value="">{existingSubjects.length ? 'Select a Subject' : 'No subjects found (Select Branch first)'}</option>
                 {existingSubjects.map(s => <option key={s._id} value={s.subjectName}>{s.subjectName}</option>)}
               </select>
            </div>
          )}

          {mode === 'add_material' && (
            <div className="border-t pt-4 mt-4 space-y-4">
               <h3 className="font-semibold text-gray-700">Resource Details</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" required 
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Unit 1 Lecture Notes"
                      value={formData.resourceTitle}
                      onChange={e => setFormData({...formData, resourceTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={formData.resourceType}
                      onChange={e => setFormData({...formData, resourceType: e.target.value})}
                    >
                      {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link (URL)</label>
                  <input 
                    type="url" required 
                    className="w-full p-2 border rounded-md"
                    placeholder="https://drive.google.com/..."
                    value={formData.resourceLink}
                    onChange={e => setFormData({...formData, resourceLink: e.target.value})}
                  />
               </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-nit-primary text-white py-2 rounded-lg hover:bg-blue-900 transition flex justify-center items-center"
          >
            {loading ? <Loader className="animate-spin w-5 h-5"/> : (mode === 'create_subject' ? 'Create Subject' : 'Add Resource')}
          </button>
        </form>
      </div>
    </div>
  );
};

const SeniorsTab = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    category: 'Alumni',
    company: '',
    linkedin: '',
    imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/seniors', formData);
      setMsg('Profile added successfully!');
      setFormData({ name: '', branch: '', category: 'Alumni', company: '', linkedin: '', imageUrl: '' });
    } catch (err) {
      setMsg('Failed to add profile.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Add Senior/Alumni</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {msg && <div className="mb-4 text-green-600 font-medium">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <input type="text" required className="w-full p-2 border rounded-md" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
               <select required className="w-full p-2 border rounded-md" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
                 <option value="">Select</option>
                 {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
               <select required className="w-full p-2 border rounded-md" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                 {SENIOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
               <input type="text" className="w-full p-2 border rounded-md" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
             <input type="url" className="w-full p-2 border rounded-md" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
             <input type="url" className="w-full p-2 border rounded-md" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
             <p className="text-xs text-gray-500 mt-1">Leave blank for default avatar</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-nit-primary text-white py-2 rounded-lg hover:bg-blue-900 transition flex justify-center items-center">
             {loading ? <Loader className="animate-spin w-5 h-5"/> : 'Add Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contributions', { params: { status: 'pending' } });
      setContributions(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    setProcessingId(id);
    try {
      await api.put(`/contributions/${id}`, { status });
      fetchContributions(); // Refresh list
    } catch (e) { alert('Action failed'); }
    finally { setProcessingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-800">Pending Contributions</h2>
         <button onClick={fetchContributions} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>
      
      {loading && !contributions.length ? (
        <div className="flex justify-center py-10"><Loader className="animate-spin text-nit-primary"/></div>
      ) : contributions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow border text-center text-gray-500">
           No pending contributions found.
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${item.type === 'bug' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                     {item.type}
                   </span>
                   <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                   <span className="text-xs text-gray-400">by {item.submittedBy}</span>
                </div>
                <p className="text-gray-800 mb-3">{item.description}</p>
                {item.type === 'resource' && item.details && (
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 border">
                    <p><strong>Branch:</strong> {item.details.branch}, <strong>Sem:</strong> {item.details.semester}</p>
                    <p><strong>Subject:</strong> {item.details.subjectName}</p>
                    <p><strong>Link:</strong> <a href={item.details.link} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate">{item.details.link}</a></p>
                    <p className="text-xs text-gray-400 mt-2 italic">Approval will attempt to add this to the subject resources.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(item._id, 'approved')}
                  disabled={processingId === item._id}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-50" 
                  title="Approve"
                >
                  {processingId === item._id ? <Loader className="animate-spin w-5 h-5"/> : <Check size={20} />}
                </button>
                <button 
                  onClick={() => handleAction(item._id, 'rejected')}
                  disabled={processingId === item._id}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50" 
                  title="Reject"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
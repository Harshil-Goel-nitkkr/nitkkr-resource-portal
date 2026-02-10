import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Lock } from 'lucide-react';
import { api } from '../services/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/admin/login', { email, password });
      if (res.data && res.data.user) {
        login(res.data.user, 'admin');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-2xl border-t-4 border-gray-800">
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-3 rounded-full text-white">
          <Shield className="w-8 h-8" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Portal</h2>
      
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-gray-800 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
             <input
              type="password"
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
        <button 
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white transition ${loading ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-900'}`}
        >
          {loading ? 'Authenticating...' : 'Secure Login'}
        </button>
      </form>
    </div>
  );
}
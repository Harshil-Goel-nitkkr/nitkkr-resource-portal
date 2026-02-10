import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Key, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';

export default function UserLogin() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitkkr\.ac\.in$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid @nitkkr.ac.in email address.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', { email, otp, rememberMe });
      if (res.data && res.data.user) {
        login(res.data.user, 'user');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-nit-primary mb-6">Student Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary focus:border-transparent outline-none transition"
                placeholder="rollno@nitkkr.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Only @nitkkr.ac.in emails are accepted.</p>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-nit-primary focus:ring-nit-primary border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me for 7 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-nit-primary hover:bg-blue-900'} transition-colors`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">OTP sent to <span className="font-semibold">{email}</span></p>
            <button type="button" onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline">Change Email</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary outline-none"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
             <p className="text-xs text-gray-400 mt-1">Check your inbox or server console in dev mode.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
      )}
    </div>
  );
}
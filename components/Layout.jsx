import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut } from 'lucide-react';
import { logout as logoutApi } from '../services/api.js';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout to clear the token cookie
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local auth state regardless of API success
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-nit-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" alt="Logo" className="w-8 h-8 object-contain"/> 
              </div>
              <span className="font-bold text-xl tracking-wide">NIT KKR Resources</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="hidden md:block text-sm opacity-90">
                    Welcome, {user.name || user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login/user" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition">Student</Link>
                  <Link to="/login/admin" className="text-sm border border-white hover:bg-white hover:text-nit-primary px-3 py-2 rounded transition">Admin</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} NIT Kurukshetra. Student Resource Portal.</p>
        </div>
      </footer>
    </div>
  );
};
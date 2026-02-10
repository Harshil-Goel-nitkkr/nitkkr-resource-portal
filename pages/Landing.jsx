import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      <div className="text-center space-y-4 animate-fade-in-up">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" 
          alt="NIT KKR Logo" 
          className="w-32 h-32 mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-nit-primary">
          NIT Kurukshetra Resource Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          One-stop destination for study materials, alumni connections, and contributions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Student Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-nit-primary hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <Users className="w-8 h-8 text-nit-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Student Login</h2>
          <p className="text-gray-500 text-center mb-8">
            Access resources, view seniors, and report bugs. Must use institute email (@nitkkr.ac.in).
          </p>
          <Link 
            to="/login/user" 
            className="block w-full py-3 bg-nit-primary text-white text-center rounded-lg font-semibold hover:bg-blue-900 transition-colors"
          >
            Login as Student
          </Link>
        </div>

        {/* Admin Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-center mb-8">
            Manage resources, approve contributions, and maintain the student database.
          </p>
          <Link 
            to="/login/admin" 
            className="block w-full py-3 bg-gray-800 text-white text-center rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Login as Admin
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-500 mt-12">
        <div className="flex flex-col items-center">
            <BookOpen className="mb-2" />
            <span>Curated Notes</span>
        </div>
        <div className="flex flex-col items-center">
            <GraduationCap className="mb-2" />
            <span>Alumni Network</span>
        </div>
        <div className="flex flex-col items-center">
            <Users className="mb-2" />
            <span>Senior Support</span>
        </div>
        <div className="flex flex-col items-center">
            <ShieldCheck className="mb-2" />
            <span>Secure Access</span>
        </div>
      </div>
    </div>
  );
}
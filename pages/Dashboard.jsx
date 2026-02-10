import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, UploadCloud } from 'lucide-react';

export default function Dashboard() {
  const options = [
    {
      title: "Resources",
      icon: <BookOpen className="w-10 h-10 text-white" />,
      desc: "Access notes, books, PYQs, and lecture links for your branch and semester.",
      link: "/resources",
      color: "bg-blue-600"
    },
    {
      title: "Connect with Seniors",
      icon: <Users className="w-10 h-10 text-white" />,
      desc: "Find and connect with seniors and alumni from your branch.",
      link: "/seniors",
      color: "bg-green-600"
    },
    {
      title: "Report Bug & Contribute",
      icon: <UploadCloud className="w-10 h-10 text-white" />,
      desc: "Help us improve by uploading resources or reporting issues.",
      link: "/contribute",
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {options.map((opt, idx) => (
          <Link 
            key={idx} 
            to={opt.link} 
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${opt.color} p-6 flex justify-center items-center`}>
              {opt.icon}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-nit-primary transition-colors">{opt.title}</h3>
              <p className="text-gray-600">{opt.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import UserLogin from './pages/UserLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resources from './pages/Resources.jsx';
import Seniors from './pages/Seniors.jsx';
import Contribute from './pages/Contribute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// --- Protected Route ---
const ProtectedRoute = ({ children, allowedType }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedType && user.type !== allowedType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- App Component ---
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login/user" element={<Layout><UserLogin /></Layout>} />
          <Route path="/login/admin" element={<Layout><AdminLogin /></Layout>} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedType="user">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute allowedType="user">
              <Layout><Resources /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/seniors" element={
            <ProtectedRoute allowedType="user">
              <Layout><Seniors /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/contribute" element={
            <ProtectedRoute allowedType="user">
              <Layout><Contribute /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedType="admin">
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
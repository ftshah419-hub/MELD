import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleRoute from '../components/common/RoleRoute';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

// Common Website Pages
import Home from '../pages/common/Home';
import About from '../pages/common/About';
import Explore from '../pages/common/Explore';
import HowItWorks from '../pages/common/HowItWorks';
import Impact from '../pages/common/Impact';
import Contact from '../pages/common/Contact';
import NotFound from '../pages/common/NotFound';

// Authentication Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

import {
  LayoutDashboard,
  Shield,
  UserCheck,
  CheckCircle2,
  Code2,
  ExternalLink,
  LogOut
} from 'lucide-react';

import UserDashboard from '../pages/user/UserDashboard';

/**
 * Person 2: User Dashboard Integration Component
 * Protected file policy: src/pages/user/ is owned exclusively by Person 2.
 * This handoff container mounts Person 2's dashboard and provides seamless session context.
 */
function UserDashboardIntegration() {
  return <UserDashboard />;
}

/**
 * Person 3: Admin Dashboard Integration Component
 * Protected file policy: src/pages/admin/ is owned exclusively by Person 3.
 * Mounts Person 3's complete administrative management suite.
 */
function AdminDashboardIntegration() {
  return <AdminDashboard />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Pages (Using AuthLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Pages (Using MainLayout with Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected User Dashboard Destination */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['USER', 'ADMIN']}>
                <UserDashboardIntegration />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard Destination */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ADMIN']}>
                <Navigate to="/admin/dashboard" replace />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboardIntegration />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboardIntegration />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

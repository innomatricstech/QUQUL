import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Products', href: '/admin/products', icon: CubeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500">
          <Link to="/admin" className="text-xl font-bold text-white tracking-wider">
            QUQU ADMIN
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-3 my-1 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyPoundIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    orderGrowth: 15, // Example growth percentages
    revenueGrowth: 25,
    productGrowth: 10,
    userGrowth: 20
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/admin/stats');
      
      if (response.data.success) {
        setStats(response.data.data.stats);
        setOrders(response.data.data.recentOrders);
      } else {
        throw new Error(response.data.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      growth: stats.orderGrowth,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `£${stats.totalRevenue.toFixed(2)}`,
      icon: CurrencyPoundIcon,
      growth: stats.revenueGrowth,
      color: 'from-green-500 to-green-600',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      growth: stats.productGrowth,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      growth: stats.userGrowth,
      color: 'from-pink-500 to-pink-600',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm">
              <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br ${stat.color} opacity-10`}></div>
              <div className="flex items-center">
                <div className={`rounded-lg ${stat.lightColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.growth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${
                  stat.growth >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(stat.growth)}% from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {order.customer.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">£{order.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="text-purple-600 hover:text-purple-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
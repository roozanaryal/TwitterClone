import { useState, useEffect, useCallback, useMemo } from 'react';
import useAPICall from '../api/useAPICall.js';
import AdBannerManager from './AdBannerManager.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import useLogout from '../hooks/useLogout.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, admins: 0, regular: 0, newToday: 0, newThisWeek: 0, newThisMonth: 0 },
    posts: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    engagement: { totalComments: 0, commentsToday: 0, totalLikes: 0, totalBookmarks: 0 },
    mostActiveUsers: [],
    recentPosts: [],
    growthData: []
  });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  // UI/UX: pagination and debounced search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(userSearchQuery.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [userSearchQuery]);

  // Derived filtered users
  const filteredUsers = useMemo(() => {
    if (!debouncedQuery) return users;
    return users.filter((user) => (
      (user.name && user.name.toLowerCase().includes(debouncedQuery)) ||
      (user.username && user.username.toLowerCase().includes(debouncedQuery)) ||
      (user.email && user.email.toLowerCase().includes(debouncedQuery))
    ));
  }, [users, debouncedQuery]);

  // Pagination slice
  const totalUsersCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsersCount / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [debouncedQuery, pageSize]);

  const callAPI = useAPICall();

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      // Add a small delay to ensure auth context is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let statsData = null;
      let userData = null;

      // Try to fetch comprehensive dashboard stats
      try {
        statsData = await callAPI('admin/dashboard/stats', 'GET');
        setDashboardStats(statsData.stats);
      } catch (statsError) {
        console.warn('Advanced stats unavailable, using basic fallback:', statsError.message);
      }

      // Always fetch user list separately since stats endpoint doesn't include full user data
      try {
        userData = await callAPI('users/all', 'GET');
        const userList = userData.users || [];
        setUsers(userList);
        
        // If stats failed, calculate basic stats from user data
        if (!statsData) {
          const admins = userList.filter(user => user.isAdmin).length;
          setDashboardStats({
            users: { 
              total: userList.length, 
              admins, 
              regular: userList.length - admins,
              newToday: 0,
              newThisWeek: 0,
              newThisMonth: 0
            },
            posts: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            engagement: { totalComments: 0, commentsToday: 0, totalLikes: 0, totalBookmarks: 0 },
            mostActiveUsers: [],
            recentPosts: [],
            growthData: []
          });
        }
      } catch (userError) {
        console.error('Failed to fetch users:', userError.message);
        setUsers([]);
      }
      
      // Ad banner config is now handled by AdBannerManager component
      
      // Removed system health fetch and UI per user request
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Check if it's a JSON parsing error (HTML response)
      if (error.message.includes('Unexpected token') || error.message.includes('<!doctype')) {
        console.warn('Received HTML response instead of JSON, but continuing without reload');
        return;
      }
      
      alert(`Failed to load dashboard data: ${error.message}`);
    }
  }, [callAPI]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };

    if (callAPI) {
      loadData();
    }
  }, [callAPI, fetchDashboardData]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Ad banner management is now handled by AdBannerManager component

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleAdmin = async (user) => {
    if (!user || !user._id) return;
    setActionLoadingId(user._id);
    try {
      const data = await callAPI(`admin/users/${user._id}/toggle-admin`, 'PATCH');
      const updated = data.user;
      // Update users list
      setUsers(prev => prev.map(u => u._id === updated._id ? { ...u, isAdmin: updated.isAdmin } : u));
      // Update dashboard admin/regular counts
      setDashboardStats(prev => {
        const wasAdmin = !!user.isAdmin;
        const nowAdmin = !!updated.isAdmin;
        if (wasAdmin === nowAdmin) return prev;
        const deltaAdmins = nowAdmin ? 1 : -1;
        return {
          ...prev,
          users: {
            ...prev.users,
            admins: prev.users.admins + deltaAdmins,
            regular: prev.users.regular - deltaAdmins,
          }
        };
      });
    } catch (error) {
      console.error('Failed to toggle admin:', error);
      alert(error.message || 'Failed to toggle admin status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!user || !user._id) return;
    if (!confirm(`Delete user @${user.username}? This cannot be undone.`)) return;
    setDeleteLoadingId(user._id);
    try {
      await callAPI(`admin/users/${user._id}`, 'DELETE');
      // Remove from users list
      setUsers(prev => prev.filter(u => u._id !== user._id));
      // Update totals
      setDashboardStats(prev => {
        const wasAdmin = !!user.isAdmin;
        return {
          ...prev,
          users: {
            ...prev.users,
            total: Math.max(0, (prev.users.total || 0) - 1),
            admins: wasAdmin ? Math.max(0, (prev.users.admins || 0) - 1) : prev.users.admins,
            regular: !wasAdmin ? Math.max(0, (prev.users.regular || 0) - 1) : prev.users.regular,
          }
        };
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your Twitter clone application</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {authUser?.name || authUser?.username || 'Admin'}</span>
              </div>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'User Management', icon: '👥' },
              { id: 'ads', name: 'Ad Banner Control', icon: '📢' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              {/* Stats Cards Row 1 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.users.total}</p>
                    <p className="text-xs text-green-600">+{dashboardStats.users.newToday} today</p>
                  </div>
                </div>
              </div>


              {/* Stats Cards Row 2 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔑</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admin Users</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.users.admins}</p>
                    <p className="text-xs text-gray-500">{dashboardStats.users.regular} regular users</p>
                  </div>
                </div>
              </div>


              {/* System Status card removed per user request */}

              {/* Quick Actions */}
              <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => setActiveTab('ads')}
                    className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <span className="text-2xl text-white">📢</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Manage Ad Banner</h4>
                      <p className="text-sm text-gray-600">Control ad visibility and content</p>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className="group relative bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <span className="text-2xl text-white">👥</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">View Users</h4>
                      <p className="text-sm text-gray-600">Browse all registered users</p>
                    </div>
                    <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
                  </button>

                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-center relative z-10">
                      <div className={`w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md ${loading ? 'animate-spin' : ''}`}
                        style={{ transform: loading ? 'scale(1.1)' : '' }}
                      >
                        <span className="text-2xl text-white">{loading ? '🔄' : '🔄'}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Refresh Dashboard</h4>
                      <p className="text-sm text-gray-600">Update all stats and data</p>
                    </div>
                    <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage all registered users</p>
              </div>

              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name, username, or email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 justify-between md:justify-end">
                  <span className="text-sm text-gray-500">{totalUsersCount} result{totalUsersCount === 1 ? '' : 's'}</span>
                  <label className="text-sm text-gray-600">
                    Page size
                    <select
                      className="ml-2 px-2 py-1 border border-gray-300 rounded-md"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      {[5,10,20,50].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Followers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Following
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profilePicture ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={user.profilePicture}
                                  alt={user.name || user.username || 'User'}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium text-sm">
                                    {(user.name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || user.username || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">@{user.username || 'unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.followers?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.following?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? formatDate(user.createdAt) : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleAdmin(user)}
                              disabled={actionLoadingId === user._id}
                              className={`px-3 py-1 rounded-md text-white ${user.isAdmin ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50 shadow-sm`}
                            >
                              {actionLoadingId === user._id ? '...' : user.isAdmin ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              disabled={deleteLoadingId === user._id}
                              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 shadow-sm"
                            >
                              {deleteLoadingId === user._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalUsersCount)}</span>
                  {' '}to <span className="font-medium">{Math.min(currentPage * pageSize, totalUsersCount)}</span>
                  {' '}of <span className="font-medium">{totalUsersCount}</span> users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
              
              {totalUsersCount === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">👥</div>
                  <p className="text-gray-700 font-medium">No users found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {/* Ad Banner Control Tab */}
          {activeTab === 'ads' && (
            <AdBannerManager />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

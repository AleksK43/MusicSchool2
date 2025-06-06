import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import CreateUserModal from '../../../components/common/Modal/CreateUserModal';

const AdminUsers = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    instrument: '',
    bio: '',
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      // AuthService.apiCall już zwraca JSON, nie raw response
      const data = await AuthService.apiCall(`/admin/users?${queryParams}`);
      
      console.log('Users data received:', data);
      setUsers(data.data || data.users || []); // Sprawdź różne możliwe klucze
    } catch (error) {
      console.error('Fetch users error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      phone: user.phone || '',
      instrument: user.instrument || '',
      bio: user.bio || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCreateUser = () => {
    setCreateFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      instrument: '',
      bio: '',
      is_active: true
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      const data = await AuthService.apiCall(`/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });

      console.log('Update user response:', data);
      await fetchUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Update user error:', error);
      setError(error.message);
    }
  };

  const handleCreateUserSubmit = async () => {
    try {
      const data = await AuthService.apiCall('/admin/users', {
        method: 'POST',
        body: JSON.stringify(createFormData)
      });

      console.log('Create user response:', data);
      await fetchUsers();
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        phone: '',
        instrument: '',
        bio: '',
        is_active: true
      });
    } catch (error) {
      console.error('Create user error:', error);
      setError(error.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const data = await AuthService.apiCall(`/admin/users/${userId}/toggle-status`, {
        method: 'PATCH'
      });

      console.log('Toggle status response:', data);
      await fetchUsers();
    } catch (error) {
      console.error('Toggle status error:', error);
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return;
    }

    try {
      const data = await AuthService.apiCall(`/admin/users/${userId}`, {
        method: 'DELETE'
      });

      console.log('Delete user response:', data);
      await fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      setError(error.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300';
      case 'teacher': return 'bg-purple-500/20 text-purple-300';
      case 'student': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-16">

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-light text-white">Filtry wyszukiwania</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateUser}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-light tracking-wide hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                + Dodaj użytkownika
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-slate-300 text-sm font-light mb-2">Szukaj</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Nazwa lub email..."
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-slate-300 text-sm font-light mb-2">Rola</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
                  <option value="all">Wszystkie</option>
                  <option value="student">Studenci</option>
                  <option value="teacher">Nauczyciele</option>
                  <option value="admin">Administratorzy</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-slate-300 text-sm font-light mb-2">Sortuj według</label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
                  <option value="created_at">Data rejestracji</option>
                  <option value="name">Nazwa</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-slate-300 text-sm font-light mb-2">Kolejność</label>
                <select
                  value={filters.sort_order}
                  onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
                  <option value="desc">Malejąco</option>
                  <option value="asc">Rosnąco</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
                />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-slate-400">Brak użytkowników spełniających kryteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Użytkownik</th>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Rola</th>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Instrument</th>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Status</th>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Data rejestracji</th>
                      <th className="text-left px-6 py-4 text-slate-300 font-light">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
                        className="border-t border-slate-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-light">{user.name}</p>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300">{user.instrument || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {user.is_active ? 'Aktywny' : 'Nieaktywny'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300">
                            {new Date(user.created_at).toLocaleDateString('pl-PL')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditUser(user)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Edytuj"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-1 ${user.is_active ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}
                              title={user.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                            >
                              {user.is_active ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Usuń"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={createFormData}
        setFormData={setCreateFormData}
        onSubmit={handleCreateUserSubmit}
        isLoading={isLoading}
      />

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsEditModalOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">Edytuj użytkownika</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">Imię i nazwisko</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">Rola</label>
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Nauczyciel</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">Instrument</label>
                    <input
                      type="text"
                      value={editFormData.instrument}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, instrument: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-300 text-sm font-light mb-2">Biografia</label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Biografia użytkownika..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={editFormData.is_active}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="is_active" className="text-slate-300 text-sm font-light">
                        Konto aktywne
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Anuluj
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveUser}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  >
                    Zapisz
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
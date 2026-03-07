import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, ShieldCheck, Ban, CheckCircle2, MoreVertical,
  ChevronLeft, ChevronRight, User, Mail
} from 'lucide-react';
import { getUsers, updateUserRole, toggleUserActive } from '../../utils/api';
import PageTransition from '../../components/ui/PageTransition';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const { data } = await getUsers(params);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      setMenuOpen(null);
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const { data } = await toggleUserActive(userId);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: data.user.isActive } : u)));
      setMenuOpen(null);
      toast.success(data.user.isActive ? 'User activated' : 'User deactivated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage all platform users</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="glass-input pl-10 w-full"
          />
        </form>
        <div className="flex gap-2">
          {['', 'student', 'instructor', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs capitalize transition ${
                roleFilter === r ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="glass-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="glass-table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar text-xs w-9 h-9">{user.name?.charAt(0)}</div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-white/50">{user.email}</span>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${
                        user.role === 'admin' ? 'badge-danger' : user.role === 'instructor' ? 'badge-purple' : 'badge-primary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`flex items-center gap-1.5 text-xs ${user.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-white/30">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === user._id ? null : user._id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuOpen === user._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-full mt-1 w-44 glass-card !p-1.5 z-20 shadow-2xl"
                          >
                            <p className="text-[10px] text-white/20 px-2.5 py-1.5 uppercase tracking-wider">Change Role</p>
                            {['student', 'instructor', 'admin'].map((r) => (
                              <button
                                key={r}
                                onClick={() => handleRoleChange(user._id, r)}
                                className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-sm capitalize transition ${
                                  user.role === r ? 'text-primary-400 bg-primary-500/10' : 'text-white/50 hover:bg-white/5'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" /> {r}
                              </button>
                            ))}
                            <div className="my-1 border-t border-white/5" />
                            <button
                              onClick={() => handleToggleActive(user._id)}
                              className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-sm transition ${
                                user.isActive
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-emerald-400 hover:bg-emerald-500/10'
                              }`}
                            >
                              {user.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04]">
              <span className="text-xs text-white/30">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
};

export default AdminUsers;

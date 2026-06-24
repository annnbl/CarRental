import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="admin-page-header">
          <h1 className="page-title">Manage Users</h1>
          <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{users.length} registered users</span>
        </div>

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-light)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{u.phone || '—'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

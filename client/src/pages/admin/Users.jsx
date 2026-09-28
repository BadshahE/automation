import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users as UsersIcon, CheckCircle2, XCircle, Search, ShieldAlert } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleUser(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Creator Account Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            View all registered creators, inspect Facebook & Instagram connections, and toggle account access.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search creator name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 14px 8px 36px', width: '260px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Creator</th>
              <th>Email</th>
              <th>Facebook Page</th>
              <th>Instagram</th>
              <th>Total Posts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>
                  {u.facebook_connected ? (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Connected</span>
                  ) : (
                    <span className="badge badge-warning">Not Connected</span>
                  )}
                </td>
                <td>
                  {u.instagram_connected ? (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Connected</span>
                  ) : (
                    <span className="badge badge-warning">Not Connected</span>
                  )}
                </td>
                <td><strong>{u.posts_count}</strong></td>
                <td>
                  {u.active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-error">Disabled</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={u.active ? 'btn-danger' : 'btn-primary'}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    {u.active ? 'Disable Creator' : 'Enable Creator'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

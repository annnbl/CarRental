import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const statusMap = {};
  (stats?.bookingsByStatus || []).forEach((s) => { statusMap[s._id] = s.count; });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-card-icon" style={{ background: '#dbeafe' }}>👥</div>
            <div>
              <div className="stat-card-num">{stats?.totalUsers || 0}</div>
              <div className="stat-card-lbl">Total Users</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-card-icon" style={{ background: '#d1fae5' }}>🚗</div>
            <div>
              <div className="stat-card-num">{stats?.totalCars || 0}</div>
              <div className="stat-card-lbl">Total Cars</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-card-icon" style={{ background: '#fef3c7' }}>📋</div>
            <div>
              <div className="stat-card-num">{stats?.totalBookings || 0}</div>
              <div className="stat-card-lbl">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-card-icon" style={{ background: '#ede9fe' }}>💰</div>
            <div>
              <div className="stat-card-num">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
              <div className="stat-card-lbl">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Booking status breakdown */}
        <div className="dashboard-grid">
          <div className="card status-breakdown">
            <h2>Bookings by Status</h2>
            <div className="status-list">
              {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                <div key={s} className="status-item">
                  <span className={`badge badge-${s}`}>{s}</span>
                  <span className="status-count">{statusMap[s] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="card recent-bookings">
            <h2>Recent Bookings</h2>
            {(stats?.recentBookings || []).length === 0 ? (
              <p className="no-data">No bookings yet</p>
            ) : (
              <div className="recent-list">
                {stats.recentBookings.map((b) => (
                  <div key={b._id} className="recent-item">
                    <div>
                      <div className="recent-name">{b.userId?.name}</div>
                      <div className="recent-car">{b.carId?.carName}</div>
                      <div className="recent-date">{formatDate(b.createdAt)}</div>
                    </div>
                    <div className="recent-right">
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                      <span className="recent-amount">₹{b.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

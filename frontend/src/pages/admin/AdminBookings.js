import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBookings, updateBookingStatus } from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchBookings = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const res = await getAllBookings(params);
      setBookings(res.data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="admin-page-header">
          <h1 className="page-title">Manage Bookings</h1>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.userId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{b.userId?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.carId?.carName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{b.carId?.brand}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <div>{formatDate(b.startDate)}</div>
                    <div style={{ color: 'var(--gray-500)' }}>→ {formatDate(b.endDate)}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{b.totalAmount.toLocaleString()}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td>
                    <div className="action-btns">
                      {b.status === 'pending' && (
                        <>
                          <button className="btn btn-sm" style={{ background: '#d1fae5', color: '#065f46', border: 'none' }}
                            onClick={() => handleStatus(b._id, 'confirmed')}>Confirm</button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleStatus(b._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <>
                          <button className="btn btn-sm" style={{ background: '#dbeafe', color: '#1e40af', border: 'none' }}
                            onClick={() => handleStatus(b._id, 'completed')}>Complete</button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleStatus(b._id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                      {['cancelled', 'completed'].includes(b.status) && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

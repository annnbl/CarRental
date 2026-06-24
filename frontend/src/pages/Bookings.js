import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyBookings, cancelBooking } from '../services/api';
import './Bookings.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📋</div>
            <h3>No bookings yet</h3>
            <p>Start by browsing our available cars</p>
            <a href="/cars" className="btn btn-primary">Browse Cars</a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b._id} className="booking-card card">
                <div className="booking-car-img">
                  <img
                    src={b.carId?.image || `https://via.placeholder.com/120x80/e8f0fe/1a56db?text=${encodeURIComponent(b.carId?.carName || 'Car')}`}
                    alt={b.carId?.carName}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/120x80/e8f0fe/1a56db?text=Car'; }}
                  />
                </div>

                <div className="booking-info">
                  <div className="booking-car-name">
                    {b.carId?.carName || 'Unknown Car'}
                    <span className="booking-brand">{b.carId?.brand}</span>
                  </div>
                  <div className="booking-dates">
                    <span>📅 {formatDate(b.startDate)}</span>
                    <span className="date-arrow">→</span>
                    <span>{formatDate(b.endDate)}</span>
                  </div>
                  {b.notes && <p className="booking-notes">📝 {b.notes}</p>}
                </div>

                <div className="booking-right">
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                  <div className="booking-amount">₹{b.totalAmount.toLocaleString()}</div>
                  <div className="booking-date-created">Booked {formatDate(b.createdAt)}</div>
                  {['pending', 'confirmed'].includes(b.status) && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

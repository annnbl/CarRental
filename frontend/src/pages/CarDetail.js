import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCar, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CarDetail.css';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    getCar(id)
      .then((res) => setCar(res.data.car))
      .catch(() => navigate('/cars'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const calcTotal = () => {
    if (!booking.startDate || !booking.endDate || !car) return 0;
    const days = Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) / 86400000
    );
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (calcTotal() === 0) { toast.error('Please select valid dates'); return; }

    setSubmitting(true);
    try {
      await createBooking({ carId: id, ...booking });
      toast.success('Booking confirmed! 🎉');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!car) return null;

  const placeholderImg = `https://via.placeholder.com/800x400/e8f0fe/1a56db?text=${encodeURIComponent(car.carName)}`;
  const total = calcTotal();
  const days = booking.startDate && booking.endDate
    ? Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000)
    : 0;

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/cars')}>
          ← Back to Cars
        </button>

        <div className="car-detail-layout">
          {/* Left: Car info */}
          <div className="car-detail-info">
            <div className="car-detail-img card">
              <img
                src={car.image || placeholderImg}
                alt={car.carName}
                onError={(e) => { e.target.src = placeholderImg; }}
              />
            </div>

            <div className="car-detail-meta card">
              <div className="car-detail-title-row">
                <div>
                  <h1>{car.carName}</h1>
                  <p className="car-detail-brand">{car.brand} · {car.model}</p>
                </div>
                <div>
                  <span className={`badge badge-${car.status}`}>{car.status}</span>
                </div>
              </div>

              <div className="car-detail-specs">
                <div className="spec-item"><span>💺</span><span>{car.seats} Seats</span></div>
                <div className="spec-item"><span>⚙️</span><span>{car.transmission}</span></div>
                <div className="spec-item"><span>⛽</span><span>{car.fuelType}</span></div>
                <div className="spec-item"><span>💰</span><span>₹{car.pricePerDay.toLocaleString()}/day</span></div>
              </div>

              {car.description && (
                <p className="car-detail-desc">{car.description}</p>
              )}
            </div>
          </div>

          {/* Right: Booking form */}
          <div className="booking-panel card">
            <h2>Book This Car</h2>
            <div className="booking-price-hero">
              <span className="booking-price-amount">₹{car.pricePerDay.toLocaleString()}</span>
              <span className="booking-price-label">per day</span>
            </div>

            {car.status !== 'available' ? (
              <div className="unavailable-notice">
                <span>⚠️</span> This car is currently {car.status}
              </div>
            ) : (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label>Pick-up Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={booking.startDate}
                    onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={booking.startDate || today}
                    value={booking.endDate}
                    onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Any special requests..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  />
                </div>

                {total > 0 && (
                  <div className="booking-summary">
                    <div className="summary-row"><span>Duration</span><span>{days} day{days !== 1 ? 's' : ''}</span></div>
                    <div className="summary-row"><span>Rate</span><span>₹{car.pricePerDay.toLocaleString()}/day</span></div>
                    <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                  </div>
                )}

                {!user ? (
                  <button type="button" className="btn btn-primary w-full" onClick={() => navigate('/login')}>
                    Login to Book
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-full" disabled={submitting || total === 0}>
                    {submitting ? 'Booking...' : `Confirm Booking · ₹${total.toLocaleString()}`}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

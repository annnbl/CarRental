import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CarCard.css';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const placeholderImg = `https://via.placeholder.com/400x220/e8f0fe/1a56db?text=${encodeURIComponent(car.carName)}`;

  return (
    <div className="car-card card">
      <div className="car-card-img">
        <img
          src={car.image || placeholderImg}
          alt={car.carName}
          onError={(e) => { e.target.src = placeholderImg; }}
        />
        <span className={`badge badge-${car.status} car-status-badge`}>
          {car.status}
        </span>
      </div>

      <div className="car-card-body">
        <div className="car-card-header">
          <div>
            <h3 className="car-name">{car.carName}</h3>
            <p className="car-brand">{car.brand} · {car.model}</p>
          </div>
          <div className="car-price">
            <span className="price-amount">₹{car.pricePerDay.toLocaleString()}</span>
            <span className="price-label">/day</span>
          </div>
        </div>

        <div className="car-specs">
          <span>💺 {car.seats} seats</span>
          <span>⚙️ {car.transmission}</span>
          <span>⛽ {car.fuelType}</span>
        </div>

        {car.description && (
          <p className="car-desc">{car.description.slice(0, 80)}{car.description.length > 80 ? '...' : ''}</p>
        )}

        <button
          className="btn btn-primary w-full"
          disabled={car.status !== 'available'}
          onClick={() => navigate(`/cars/${car._id}`)}
        >
          {car.status === 'available' ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}

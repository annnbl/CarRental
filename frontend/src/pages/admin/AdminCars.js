import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCars, createCar, updateCar, deleteCar } from '../../services/api';
import './AdminCars.css';

const emptyForm = {
  carName: '', brand: '', model: '', pricePerDay: '', image: '',
  status: 'available', description: '', seats: 5, transmission: 'automatic', fuelType: 'petrol',
};

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCars = async () => {
    try {
      const res = await getCars({});
      setCars(res.data.cars);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const openAdd = () => { setEditCar(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (car) => {
    setEditCar(car);
    setForm({ carName: car.carName, brand: car.brand, model: car.model, pricePerDay: car.pricePerDay,
      image: car.image || '', status: car.status, description: car.description || '',
      seats: car.seats, transmission: car.transmission, fuelType: car.fuelType });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCar) {
        await updateCar(editCar._id, form);
        toast.success('Car updated!');
      } else {
        await createCar(form);
        toast.success('Car added!');
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await deleteCar(id);
      toast.success('Car deleted');
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="admin-page-header">
          <h1 className="page-title">Manage Cars</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Car</button>
        </div>

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Price/Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>
                    <div className="car-cell">
                      <img
                        src={car.image || `https://via.placeholder.com/48x32/e8f0fe/1a56db?text=Car`}
                        alt={car.carName}
                        className="car-thumb"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/48x32/e8f0fe/1a56db?text=Car`; }}
                      />
                      <span className="car-cell-name">{car.carName}</span>
                    </div>
                  </td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>₹{car.pricePerDay.toLocaleString()}</td>
                  <td><span className={`badge badge-${car.status}`}>{car.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(car)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>No cars yet. Add your first car.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Car Name *</label>
                  <input className="form-control" value={form.carName}
                    onChange={(e) => setForm({ ...form, carName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input className="form-control" value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Model Year *</label>
                  <input className="form-control" value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Price Per Day (₹) *</label>
                  <input type="number" className="form-control" value={form.pricePerDay}
                    onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required min="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Seats</label>
                  <input type="number" className="form-control" value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: e.target.value })} min="1" max="12" />
                </div>
                <div className="form-group">
                  <label>Transmission</label>
                  <select className="form-control" value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type</label>
                  <select className="form-control" value={form.fuelType}
                    onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-control" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input className="form-control" value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

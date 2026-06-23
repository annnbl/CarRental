import React, { useState, useEffect, useCallback } from 'react';
import { getCars, getBrands } from '../services/api';
import CarCard from '../components/CarCard';
import './Cars.css';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', brand: '', minPrice: '', maxPrice: '', status: 'available',
  });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.status) params.status = filters.status;

      const res = await getCars(params);
      setCars(res.data.cars);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  useEffect(() => {
    getBrands().then((res) => setBrands(res.data.brands)).catch(() => {});
  }, []);

  const handleFilter = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', brand: '', minPrice: '', maxPrice: '', status: '' });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="cars-header">
          <div>
            <h1>Browse Cars</h1>
            <p className="cars-subtitle">{cars.length} car{cars.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar card">
          <input
            className="form-control"
            name="search"
            placeholder="🔍 Search by name or brand..."
            value={filters.search}
            onChange={handleFilter}
          />

          <select className="form-control" name="brand" value={filters.brand} onChange={handleFilter}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <input
            className="form-control"
            name="minPrice"
            type="number"
            placeholder="Min ₹/day"
            value={filters.minPrice}
            onChange={handleFilter}
          />

          <input
            className="form-control"
            name="maxPrice"
            type="number"
            placeholder="Max ₹/day"
            value={filters.maxPrice}
            onChange={handleFilter}
          />

          <select className="form-control" name="status" value={filters.status} onChange={handleFilter}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>

          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="spinner" />
        ) : cars.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🚗</div>
            <h3>No cars found</h3>
            <p>Try adjusting your filters</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
}

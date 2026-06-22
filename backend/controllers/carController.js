const Car = require('../models/Car');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const { brand, minPrice, maxPrice, status, search } = req.query;
    let query = {};

    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { carName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: cars.length, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create car (Admin)
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res
      .status(201)
      .json({ success: true, message: 'Car added successfully', car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update car (Admin)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car updated successfully', car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete car (Admin)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all brands
// @route   GET /api/cars/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCars, getCar, createCar, updateCar, deleteCar, getBrands };

const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Helper: calculate total days
const calcDays = (start, end) => {
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, notes } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: 'Car not found' });
    }
    if (car.status !== 'available') {
      return res
        .status(400)
        .json({ success: false, message: 'Car is not available' });
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      ],
    });
    if (overlap) {
      return res.status(400).json({
        success: false,
        message: 'Car is already booked for the selected dates',
      });
    }

    const days = calcDays(startDate, endDate);
    if (days < 1) {
      return res
        .status(400)
        .json({ success: false, message: 'End date must be after start date' });
    }

    const totalAmount = days * car.pricePerDay;

    const booking = await Booking.create({
      userId: req.user._id,
      carId,
      startDate,
      endDate,
      totalAmount,
      notes,
      status: 'pending',
    });

    await booking.populate(['userId', 'carId']);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('carId')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (User)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('carId', 'carName brand model pricePerDay image')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['userId', 'carId']);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Update car status based on booking status
    if (status === 'confirmed') {
      await Car.findByIdAndUpdate(booking.carId._id, { status: 'rented' });
    } else if (['cancelled', 'completed'].includes(status)) {
      await Car.findByIdAndUpdate(booking.carId._id, { status: 'available' });
    }

    res.json({ success: true, message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const [totalUsers, totalCars, totalBookings, bookingsByStatus, recentBookings] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Car.countDocuments(),
        Booking.countDocuments(),
        Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Booking.find()
          .populate('userId', 'name email')
          .populate('carId', 'carName brand')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const revenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCars,
        totalBookings,
        totalRevenue: revenue[0]?.total || 0,
        bookingsByStatus,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
};

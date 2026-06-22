const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;

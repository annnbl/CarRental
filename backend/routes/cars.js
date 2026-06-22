const express = require('express');
const router = express.Router();
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getBrands,
} = require('../controllers/carController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/brands', getBrands);
router.get('/', getCars);
router.get('/:id', getCar);
router.post('/', protect, adminOnly, createCar);
router.put('/:id', protect, adminOnly, updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;

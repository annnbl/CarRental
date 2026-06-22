const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Car.deleteMany(), Booking.deleteMany()]);
  console.log('Cleared existing data');

  // ── Create Users ────────────────────────────────────
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@driveease.com',
    password: 'admin123',
    phone: '+91 9000000001',
    role: 'admin',
  });

  const users = await User.insertMany([
    { name: 'Rohan Sharma', email: 'rohan@example.com', password: await bcrypt.hash('user123', 12), phone: '+91 9876543210', role: 'user' },
    { name: 'Priya Patel',  email: 'priya@example.com', password: await bcrypt.hash('user123', 12), phone: '+91 9123456780', role: 'user' },
    { name: 'Arjun Mehta',  email: 'arjun@example.com', password: await bcrypt.hash('user123', 12), phone: '+91 9988776655', role: 'user' },
  ]);
  console.log('Users created:', users.length + 1);

  // ── Create Cars ─────────────────────────────────────
  const cars = await Car.insertMany([
    {
      carName: 'Toyota Innova Crysta', brand: 'Toyota', model: '2024',
      pricePerDay: 2500, status: 'available', seats: 7,
      transmission: 'automatic', fuelType: 'diesel',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter-2.jpeg',
      description: 'The most trusted MPV for families and groups. Spacious, reliable, and comfortable for long journeys.',
    },
    {
      carName: 'Hyundai Creta', brand: 'Hyundai', model: '2024',
      pricePerDay: 1800, status: 'available', seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-3.jpeg',
      description: 'A premium compact SUV with a powerful engine, stylish looks, and a feature-packed cabin.',
    },
    {
      carName: 'Maruti Swift', brand: 'Maruti Suzuki', model: '2023',
      pricePerDay: 999, status: 'available', seats: 5,
      transmission: 'manual', fuelType: 'petrol',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159073/swift-exterior-right-front-three-quarter-2.jpeg',
      description: 'India\'s favourite hatchback — peppy, fuel-efficient, and perfect for city commutes.',
    },
    {
      carName: 'Tata Nexon EV', brand: 'Tata', model: '2024',
      pricePerDay: 2200, status: 'available', seats: 5,
      transmission: 'automatic', fuelType: 'electric',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/nexon-ev-exterior-right-front-three-quarter-6.jpeg',
      description: 'India\'s best-selling electric SUV. Zero emissions, instant torque, and a certified range of 465 km.',
    },
    {
      carName: 'Honda City', brand: 'Honda', model: '2024',
      pricePerDay: 1600, status: 'available', seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134297/city-exterior-right-front-three-quarter-6.jpeg',
      description: 'The iconic premium sedan — refined, comfortable, and a joy to drive on highways and city roads alike.',
    },
    {
      carName: 'Mahindra Thar', brand: 'Mahindra', model: '2024',
      pricePerDay: 3200, status: 'available', seats: 4,
      transmission: 'manual', fuelType: 'diesel',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-6.jpeg',
      description: 'The ultimate off-road adventure machine. Take on any terrain with the iconic 4x4 capability.',
    },
    {
      carName: 'BMW 3 Series', brand: 'BMW', model: '2023',
      pricePerDay: 8000, status: 'available', seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/155603/3-series-exterior-right-front-three-quarter-3.jpeg',
      description: 'The ultimate driving machine. Sporty, luxurious, and loaded with the latest BMW technology.',
    },
    {
      carName: 'Kia Seltos', brand: 'Kia', model: '2024',
      pricePerDay: 2000, status: 'rented', seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/157171/seltos-exterior-right-front-three-quarter-4.jpeg',
      description: 'A stylish and feature-rich compact SUV that redefines the segment with its bold design.',
    },
  ]);
  console.log('Cars created:', cars.length);

  // ── Create Sample Bookings ───────────────────────────
  const bookings = await Booking.insertMany([
    {
      userId: users[0]._id,
      carId: cars[0]._id,
      startDate: new Date('2026-06-10'),
      endDate: new Date('2026-06-15'),
      totalAmount: 5 * cars[0].pricePerDay,
      status: 'completed',
      notes: 'Family trip to Coorg',
    },
    {
      userId: users[1]._id,
      carId: cars[3]._id,
      startDate: new Date('2026-06-20'),
      endDate: new Date('2026-06-23'),
      totalAmount: 3 * cars[3].pricePerDay,
      status: 'confirmed',
    },
    {
      userId: users[2]._id,
      carId: cars[5]._id,
      startDate: new Date('2026-06-25'),
      endDate: new Date('2026-06-28'),
      totalAmount: 3 * cars[5].pricePerDay,
      status: 'pending',
      notes: 'Weekend off-road adventure',
    },
    {
      userId: users[0]._id,
      carId: cars[1]._id,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-03'),
      totalAmount: 2 * cars[1].pricePerDay,
      status: 'pending',
    },
  ]);
  console.log('Bookings created:', bookings.length);

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────────');
  console.log('Admin  →  admin@driveease.com  /  admin123');
  console.log('User 1 →  rohan@example.com   /  user123');
  console.log('User 2 →  priya@example.com   /  user123');
  console.log('─────────────────────────────────────');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

# 🚗 DriveEase — Car Rental System

A full-stack MERN car rental platform with user bookings, admin management, JWT authentication, and a polished React UI.

---

## 📁 Project Structure

```
car-rental-system/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic
│   ├── middleware/      # JWT auth guard
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── seeder.js       # Sample data seeder
│   └── server.js       # Express entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Navbar, CarCard, ProtectedRoute
│       ├── context/     # AuthContext (global user state)
│       ├── pages/       # All page components
│       │   └── admin/   # Admin-only pages + layout
│       └── services/    # Axios API calls
│
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone / open the project

```bash
cd car-rental-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

Seed the database with sample cars, users & bookings:

```bash
node seeder.js
```

Start the backend server:

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Backend runs at → **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs at → **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@driveease.com    | admin123  |
| User  | rohan@example.com      | user123   |
| User  | priya@example.com      | user123   |

---

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | `/register`           | Public  | Register new user    |
| POST   | `/login`              | Public  | Login & get token    |
| GET    | `/me`                 | Private | Get current user     |
| PUT    | `/profile`            | Private | Update profile       |
| PUT    | `/change-password`    | Private | Change password      |

### Cars — `/api/cars`

| Method | Endpoint      | Access       | Description           |
|--------|---------------|--------------|-----------------------|
| GET    | `/`           | Public       | Get all cars (filterable) |
| GET    | `/:id`        | Public       | Get single car        |
| GET    | `/brands`     | Public       | Get all brands        |
| POST   | `/`           | Admin only   | Add new car           |
| PUT    | `/:id`        | Admin only   | Update car            |
| DELETE | `/:id`        | Admin only   | Delete car            |

#### Query Parameters for GET `/api/cars`

| Param      | Example            | Description           |
|------------|--------------------|-----------------------|
| `search`   | `?search=toyota`   | Search by name/brand  |
| `brand`    | `?brand=Honda`     | Filter by brand       |
| `minPrice` | `?minPrice=1000`   | Minimum price per day |
| `maxPrice` | `?maxPrice=5000`   | Maximum price per day |
| `status`   | `?status=available`| Filter by status      |

### Bookings — `/api/bookings`

| Method | Endpoint          | Access       | Description              |
|--------|-------------------|--------------|--------------------------|
| POST   | `/`               | User         | Create booking           |
| GET    | `/my`             | User         | Get my bookings          |
| PUT    | `/:id/cancel`     | User         | Cancel my booking        |
| GET    | `/`               | Admin only   | Get all bookings         |
| GET    | `/stats`          | Admin only   | Dashboard statistics     |
| PUT    | `/:id/status`     | Admin only   | Update booking status    |

### Admin — `/api/admin`

| Method | Endpoint        | Access     | Description    |
|--------|-----------------|------------|----------------|
| GET    | `/users`        | Admin only | List all users |
| DELETE | `/users/:id`    | Admin only | Delete a user  |

---

## 📊 Database Collections

### Users
```json
{
  "_id": "ObjectId",
  "name": "Rohan Sharma",
  "email": "rohan@example.com",
  "password": "<bcrypt hash>",
  "phone": "+91 9876543210",
  "role": "user | admin",
  "createdAt": "2026-06-17T..."
}
```

### Cars
```json
{
  "_id": "ObjectId",
  "carName": "Toyota Innova Crysta",
  "brand": "Toyota",
  "model": "2024",
  "pricePerDay": 2500,
  "image": "https://...",
  "status": "available | rented | maintenance",
  "seats": 7,
  "transmission": "automatic | manual",
  "fuelType": "petrol | diesel | electric | hybrid",
  "description": "..."
}
```

### Bookings
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId → User",
  "carId": "ObjectId → Car",
  "startDate": "2026-06-20T...",
  "endDate": "2026-06-23T...",
  "totalAmount": 6600,
  "status": "pending | confirmed | cancelled | completed",
  "notes": "Optional notes"
}
```

---

## 🧪 Testing with Postman

### Setup
1. Import requests manually or create a collection.
2. Set base URL variable: `{{base_url}} = http://localhost:5000/api`
3. After login, copy the `token` from the response.
4. Add header to protected requests: `Authorization: Bearer {{token}}`

### Example flows

**Register & Login:**
```
POST {{base_url}}/auth/register
Body: { "name": "Test User", "email": "test@test.com", "password": "test123" }

POST {{base_url}}/auth/login
Body: { "email": "test@test.com", "password": "test123" }
```

**Browse & Book a Car:**
```
GET {{base_url}}/cars?status=available&brand=Toyota
GET {{base_url}}/cars/<car_id>

POST {{base_url}}/bookings
Headers: Authorization: Bearer <token>
Body: { "carId": "<id>", "startDate": "2026-07-01", "endDate": "2026-07-05" }
```

**Admin — Approve a booking:**
```
PUT {{base_url}}/bookings/<booking_id>/status
Headers: Authorization: Bearer <admin_token>
Body: { "status": "confirmed" }
```

---

## ✨ Features Implemented

### User
- Register / Login / Logout
- Browse all available cars
- Search by name / brand
- Filter by price range and status
- View car detail page
- Book a car with date selection
- Auto-calculated total price
- Overlap detection (no double-booking)
- View personal booking history
- Cancel pending/confirmed bookings
- Update profile & change password

### Admin
- Dashboard with live stats (users, cars, bookings, revenue)
- Booking breakdown by status + recent activity
- Add / Edit / Delete cars with full details
- Approve, cancel, or complete any booking
- Car status auto-updates on booking status change
- View and delete registered users

---

## 🛡️ Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens with 7-day expiry
- Protected routes via middleware (`protect`, `adminOnly`)
- Role-based access control (user vs admin)
- Input validation on all models

---

## 🔧 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18, React Router 6 |
| Styling   | Custom CSS (no framework)|
| HTTP      | Axios                    |
| Backend   | Node.js, Express.js      |
| Database  | MongoDB + Mongoose       |
| Auth      | JWT + bcryptjs           |
| Dev Tools | Nodemon, react-hot-toast |

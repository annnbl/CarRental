# CarRental

A car rental web app built with the MERN stack (MongoDB, Express, React, Node.js).

## What it does

- Users can browse cars, book them for specific dates, and view their booking history
- Admins can manage cars, approve or cancel bookings, and view all users

## Tech used

- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Authentication: JWT

## How to run

**Backend**
cd backend

npm install

npm run dev

**Frontend**
cd frontend

npm install

npm start

Make sure to create a `.env` file in the backend folder:
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

## Login credentials (for testing)

| Role  | Email                   | Password |
|-------|-------------------------|----------|
| Admin | admin@driveease.com     | admin123 |
| User  | rohan@example.com       | user123  |
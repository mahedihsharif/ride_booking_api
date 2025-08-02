# Ride Booking System

# Live Link: https://ride-booking-api-pink.vercel.app/

This is a backend API for a Ride Booking System where users (Riders and Drivers) can register, login, book rides, cancel rides (with daily limits), and more. The system enforces role-based access and JWT-based authentication.

## 🔧 Project Overview

The project includes:

- **User Roles**: Rider and Driver
- **JWT Authentication**: Secured routes for riders, drivers, and admins
- **Booking & Cancellation**: Riders can book rides and cancel them (up to 3 times per day)
- **Cancellation Limits**: Riders and Drivers are blocked after exceeding 3 cancellations in a single day. Admin can unblock them.
- **Role-Based Access**: Protected routes based on user role and authentication

## 🛠️ Setup & Environment Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mahedihsharif/ride_booking_api.git
   cd ride_booking_api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables (.env)**  
   Create a `.env` file in the root with the following content:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_url
   NODE_ENV=your_env
   ```

# JWT

```
JWT_ACCESS_SECRET=your_secret
JWT_ACCESS_EXPIRES=your_expires
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=your_expires
```

# BCRYPT

```
BCRYPT_SALT_ROUND=your_salt_round
```

# OpenCase

```
OPEN_CASE_MAPS_API_KEY=your_key
```

# PER KILOMETER RATE

```
PER_KM_RATE=your_rate
```

# Cancel Window Time

```
CANCEL_WINDOW_TIME=your_cancel_time
```

# Geo Api

GEO_LOCATION_API=your_api

````

4. **Start the Server**
```bash
npm run dev
````

## 📬 API Endpoints Summary

### Auth

- `POST /api/v1/users/register` – Register a new user with (name,email,password,phone)
- `POST /api/v1/auth/login` – Login and receive JWT token

### User

- `GET /api/v1/users/` – Get all riders -> with role Admin
- `PATCH /api/v1/users/:id` – Update rider to driver and driver to rider
- `PATCH /api/v1/users/block/:id` – block/unblock user by role Admin

### Drivers

- `GET /api/v1/drivers/` – Get all Drivers by role Admin
- `GET /api/v1/drivers/available-driver` – Get Available Drivers by role Rider
- `GET /api/v1/drivers/earnings` – Get Earnings by role Driver
- `PATCH /api/v1/drivers/availability` – set availability by Driver
- `PATCH /api/v1/drivers/approve/:id` – Approved Driver by role Admin
- `PATCH /api/v1/drivers/suspend/:id` – Suspended Driver by role Admin

### Ride

- `POST /api/v1/rides/request` – Request a Ride by role Rider
- `GET /api/v1/rides` – Get all Rides by role Admin
- `GET /api/v1/rides/me` – Get a Rider his/her all Rides by role Rider
- `GET /api/v1/rides/available` – Rides Available checked by role Driver
- `GET /api/v1/rides/completed` – Get All Completed Rides by role Driver
- `GET /api/v1/rides/history` – Get All Rides History by role Admin
- `PATCH /api/v1/rides/:id/cancel` – Ride Cancel by Rider and cancels a ride (max 3/day)
- `PATCH /api/v1/rides/:id/accept` – Ride Accept by role Driver
- `PATCH /api/v1/rides/:id/reject` – Ride Reject by role Driver
- `PATCH /api/v1/rides/:id/status` – Update Ride Status by role Driver

## 🧪 Postman API Testing

- All API routes are testable through Postman.
- Use the exported `Ride_Booking_Api.postman_collection` to import and test easily which is provide by code as json file in github.

## ✅ Additional Notes

- Cancel attempts reset daily based on system date.
- Blocked users are automatically restricted from canceling or booking until unblocked.

---

### Technology:Express, Mongoose, TypeScript, JWT.

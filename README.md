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

### JWT

```env
JWT_ACCESS_SECRET=your_secret
JWT_ACCESS_EXPIRES=your_expires
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=your_expires
```

### BCRYPT

```env
BCRYPT_SALT_ROUND=your_salt_round
```

### OpenCase

```env
OPEN_CASE_MAPS_API_KEY=your_key
```

### PER KILOMETER RATE

```env
PER_KM_RATE=your_rate
```

### Cancel Window Time

```env
CANCEL_WINDOW_TIME=your_cancel_time
```

### Geo Api

GEO_LOCATION_API=your_api

````env

4. **Start the Server**
```bash
npm run dev
````

## 📬 API Endpoints Summary

`Notice:` you can create RIDER account and then switched Driver account by Updating role:"DRIVER" but you can't create ADMIN Account Manually. So, I provide a ADMIN Auth and Please Login with this credentials:
`Admin Account Credentials: `{
"email":"admin@gmail.com",
"password":"admin123"
}`
please login in this account and check your work as role ADMIN

### Auth

- `POST https://ride-booking-api-pink.vercel.app/api/v1/users/register` – Register a new user with `(name,email,password,phone)`--> (must provide this fields in req body data as json formate, please be notice phone and email must be unique).
- `POST https://ride-booking-api-pink.vercel.app/api/v1/auth/login` – Login and receive JWT token. provide `(email and password)` in req body data as json format fields while login.

### User

- `GET https://ride-booking-api-pink.vercel.app/api/v1/users/` – Get all riders -> with role Admin--> Your must provide Admin jwt token in Headers Authorization.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/users/:id` – Update users and also update roles from RIDER to DRIVER by default RIDER will set while creating a new user and then you can change role through of this api and you must provide body data as json formate and role will `("role":"DRIVER" or "role":"RIDER")` please provide this way. and also provide Riders or Drivers jwt token in Headers Authorization and must be provide RIDER or DRIVER `(ID)` in params which user you want to update.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/users/block/:id` – block/unblock user by role Admin, and you must provide Admin jwt token in Headers Authorization for block or unblock user, and you don't need provide body data. you must need provide users `(ID)` in params.

### Drivers

- `GET https://ride-booking-api-pink.vercel.app/api/v1/drivers/` – Get all Drivers by role Admin and you must provide Admin jwt token in Headers Authorization and don't need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/drivers/available-driver` – Get Available Drivers by role Rider-> Your must provide Rider jwt token in Headers Authorization, no need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/drivers/earnings` – Get Earnings by role Driver -> Your must provide Driver jwt token in Headers Authorization, no need body data.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/drivers/availability` – set availability by Driver -> Your must provide Driver jwt token in Headers Authorization, no need body data.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/drivers/approve/:id` – Approved Driver by role Admin and Your must provide Admin jwt token in Headers Authorization, no need body data. you must need provide DRIVER `(ID)` in params.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/drivers/suspend/:id` – Suspended Driver by role Admin. Your must provide Admin jwt token in Headers Authorization, no need body data. you must need provide DRIVER `(ID)` in params.

### Ride

- `POST https://ride-booking-api-pink.vercel.app/api/v1/rides/request` – Request a Ride by role Rider. Your must provide Rider jwt token in Headers Authorization, and provide body data as json formate-> body data you must provide ( {
  "pickupLocation":{
  "address":"write you location"
  },
  "destinationLocation":{
  "address":"write you location"
  }
  }). in this formate.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/rides` – Get all Rides by role Admin. You must provide Admin jwt token in Headers Authorization, no need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/rides/me` – Get a Rider his/her all Rides by role Rider. You must provide Rider jwt token in Headers Authorization, no need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/rides/available` – Rides Available checked by role Driver. You must provide Driver jwt token in Headers Authorization, no need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/rides/completed` – Get Get All Completed Rides with status Completed by role Driver. You must provide Driver jwt token in Headers Authorization, no need body data.
- `GET https://ride-booking-api-pink.vercel.app/api/v1/rides/history` – Get All Rides History by role Admin. You must provide Admin jwt token in Headers Authorization, no need body data.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/rides/:id/cancel` – Ride Cancel by Rider and cancels a ride (max 3/day). You must provide Rider jwt token in Headers Authorization, no need body data. you must need provide RIDES `(ID)` in params. and taken maximum 3 attempts in a day to cancel and then your active status will blocked.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/rides/:id/accept` – Ride Accept by role Driver. You must provide Driver jwt token in Headers Authorization, no need body data. you must need provide RIDES `(ID)` in params.
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/rides/:id/reject` – Ride Reject by role Driver. You must provide Driver jwt token in Headers Authorization, no need body data. you must need provide RIDES `(ID)` in params and taken maximum 3 attempts in a day to reject and then your active status will blocked
- `PATCH https://ride-booking-api-pink.vercel.app/api/v1/rides/:id/status` – Update Ride Status by role Driver. You must provide Driver jwt token in Headers Authorization, you must need provide RIDES `(ID)` in params. and also must provide body data as json formate, body data should be status : ({
  "status":"PICKED_UP"|"IN_TRANSIT"|"COMPLETED"
  }) --> be careful body data will like this and write any of this value like PICKED_UP or IN_TRANSIT or COMPLETED... if you provide other value you will get Error because as body data status don't accept other value.

## 🧪 Postman API Testing

- All API routes are testable through Postman.
- Use the exported `Ride_Booking_Api.postman_collection` to import and test easily which is provide by code as json file in github.

## ✅ Additional Notes

- Cancel attempts reset daily based on system date.
- Blocked users are automatically restricted from canceling or booking until unblocked.

---

### Technology:Express, Mongoose, TypeScript, JWT.

# ShareRide

A full-stack ride-pooling/carpooling platform built with React, Node.js, Express, and MongoDB.

## Features

- 🚗 **Offer Rides** - Create rides and set your own price
- 🔍 **Find Rides** - Search for available rides with filters
- 📋 **Book Seats** - Request seats in available rides
- ✅ **Manage Bookings** - Accept or reject passenger requests
- 💳 **Payments** - Pay for accepted rides (Razorpay integration)
- 💬 **Chat** - Message other users associated with a ride
- ⭐ **Reviews** - Rate and review other users
- 📊 **Dashboard** - View upcoming and past rides

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- React Router v6
- Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Hashing

### Integrations (configurable)
- Razorpay (payments)
- Google Maps (geocoding, distance)
- Socket.io (real-time chat)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### Configuration

1. Copy environment files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Update `server/.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shareride
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Running the Application

```bash
# Run both server and client concurrently
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
ShareRide/
├── server/                 # Express.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # External service abstractions
│   └── server.js           # Entry point
├── client/                 # React frontend
│   └── src/
│       ├── api/            # API client & endpoints
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       └── utils/          # Helper functions
└── package.json            # Root scripts
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Rides
- `POST /api/rides` - Create ride
- `GET /api/rides` - Search rides (with filters)
- `GET /api/rides/:id` - Get ride details
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Delete ride
- `GET /api/rides/my/rides` - Get my rides

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get my bookings
- `GET /api/bookings/ride/:rideId` - Get ride bookings
- `PUT /api/bookings/:id/accept` - Accept booking
- `PUT /api/bookings/:id/reject` - Reject booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/pay` - Initiate payment
- `PUT /api/bookings/:id/verify-payment` - Verify payment

### Chat
- `POST /api/chat` - Create/get chat
- `GET /api/chat` - Get my chats
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/:chatId/messages` - Send message

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/ride/:rideId` - Get ride reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/:id` - Get user profile

## License

MIT

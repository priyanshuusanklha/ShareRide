import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchRides from './pages/SearchRides';
import CreateRide from './pages/CreateRide';
import RideDetails from './pages/RideDetails';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rides" element={<SearchRides />} />
            <Route path="/rides/:id" element={<RideDetails />} />
            <Route path="/users/:id" element={<UserProfile />} />
            
            {/* Protected Routes */}
            <Route path="/offer-ride" element={<ProtectedRoute><CreateRide /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

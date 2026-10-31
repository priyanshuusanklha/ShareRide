import React, { useState, useEffect } from 'react';
import { getMyRides } from '../api/rides';
import { getMyBookings, cancelBooking, initiatePayment } from '../api/bookings';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import RideCard from '../components/rides/RideCard';
import BookingCard from '../components/bookings/BookingCard';
import toast from 'react-hot-toast';

const MyRides = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'driver') {
        const data = await getMyRides();
        setRides(data);
      } else {
        const data = await getMyBookings();
        setBookings(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handlePayBooking = async (bookingId) => {
    try {
      const order = await initiatePayment(bookingId);
      // In mock mode, payment is auto-verified
      if (order.mock) {
        toast.success('Payment completed (mock mode)');
        fetchData();
      } else {
        toast('Payment gateway integration coming soon', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Rides</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('driver')}
            className={`${activeTab === 'driver' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Offered Rides (As Creator)
          </button>
          <button
            onClick={() => setActiveTab('passenger')}
            className={`${activeTab === 'passenger' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Bookings (As Passenger)
          </button>
        </nav>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchData()} />
      ) : activeTab === 'driver' ? (
        rides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map(ride => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>
        ) : (
          <EmptyState title="No rides offered" description="You haven't created any rides yet." />
        )
      ) : (
        bookings.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {bookings.map(booking => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={handleCancelBooking}
                onPay={handlePayBooking}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No bookings" description="You haven't booked any rides yet." />
        )
      )}
    </div>
  );
};

export default MyRides;

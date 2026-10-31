import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getMyRides } from '../api/rides';
import { getMyBookings } from '../api/bookings';
import Loading from '../components/common/Loading';
import RideCard from '../components/rides/RideCard';
import BookingCard from '../components/bookings/BookingCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ridesData, bookingsData] = await Promise.all([
          getMyRides(),
          getMyBookings()
        ]);
        setRides(ridesData.slice(0, 3)); // Just show recent 3
        setBookings(bookingsData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Quick Actions</dt>
                  <dd className="flex space-x-2 mt-1">
                    <Link to="/offer-ride" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Offer Ride</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/rides" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Find Ride</Link>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Rides Offered</h2>
            <Link to="/my-rides" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</Link>
          </div>
          {rides.length > 0 ? (
            <div className="space-y-4">
              {rides.map(ride => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              You haven't offered any rides yet.
              <div className="mt-4">
                <Link to="/offer-ride" className="btn-primary">Offer a Ride</Link>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/my-rides" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</Link>
          </div>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              You haven't booked any rides yet.
              <div className="mt-4">
                <Link to="/rides" className="btn-secondary">Find a Ride</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

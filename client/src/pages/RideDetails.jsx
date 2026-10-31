import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getRide } from '../api/rides';
import { createBooking, getRideBookings, acceptBooking, rejectBooking } from '../api/bookings';
import { createOrGetChat } from '../api/chat';
import { getRideReviews } from '../api/reviews';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import BookingRequestCard from '../components/bookings/BookingRequestCard';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const RideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const data = await getRide(id);
        setRide(data);
        
        // Fetch reviews for this ride
        try {
          const reviewsData = await getRideReviews(id);
          setReviews(reviewsData);
        } catch {}

        // If current user is the driver, fetch bookings
        if (user && data.driver?._id === user._id) {
          try {
            const bookingsData = await getRideBookings(id);
            setBookings(bookingsData);
          } catch {}
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id, user]);

  const handleBook = async () => {
    if (!user) return navigate('/login', { state: { from: { pathname: `/rides/${id}` } } });
    
    setBookingLoading(true);
    try {
      await createBooking({ rideId: id, seatsRequested });
      toast.success('Booking request sent successfully!');
      navigate('/my-rides');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to book ride');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessageDriver = async () => {
    if (!user) return navigate('/login');
    try {
      const chat = await createOrGetChat({ targetUserId: ride.creator._id, rideId: id });
      navigate('/chat', { state: { activeChatId: chat._id } });
    } catch (err) {
      toast.error('Failed to start chat');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      toast.success('Booking accepted!');
      // Refresh bookings
      const updated = await getRideBookings(id);
      setBookings(updated);
      // Refresh ride for updated seat count
      const updatedRide = await getRide(id);
      setRide(updatedRide);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await rejectBooking(bookingId);
      toast.success('Booking rejected');
      const updated = await getRideBookings(id);
      setBookings(updated);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject booking');
    }
  };

  if (loading) return <Loading message="Loading ride details..." />;
  if (error) return <div className="max-w-7xl mx-auto p-8"><ErrorMessage message={error} /></div>;
  if (!ride) return <div className="max-w-7xl mx-auto p-8"><ErrorMessage message="Ride not found" /></div>;

  const originDisplay = ride.origin?.address || ride.origin || '';
  const destDisplay = ride.destination?.address || ride.destination || '';
  const priceDisplay = ride.pricePerSeat ?? ride.price ?? 0;
  const timeDisplay = ride.departureTime || ride.time || '';
  const isDriver = user && ride.creator?._id === user._id;
  const isAvailable = ride.availableSeats > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ride.status === 'active' ? 'bg-green-100 text-green-800' :
                ride.status === 'full' ? 'bg-yellow-100 text-yellow-800' :
                ride.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ride.status?.charAt(0).toUpperCase() + ride.status?.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{originDisplay} → {destDisplay}</h1>
            <p className="text-gray-500 mb-6">
              {ride.date ? format(new Date(ride.date), 'EEEE, MMMM d, yyyy') : ''}{timeDisplay ? ` at ${timeDisplay}` : ''}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border-t border-b py-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-lg">₹{priceDisplay} <span className="text-sm font-normal">/seat</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Seats</p>
                <p className="font-semibold text-lg">{ride.availableSeats} / {ride.totalSeats}</p>
              </div>
              {ride.vehicle && (ride.vehicle.make || ride.vehicle.model) && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-semibold">{ride.vehicle.make} {ride.vehicle.model} {ride.vehicle.color ? `(${ride.vehicle.color})` : ''}</p>
                  {ride.vehicle.plateNumber && <p className="text-xs text-gray-400">{ride.vehicle.plateNumber}</p>}
                </div>
              )}
            </div>
            
            {ride.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Driver's Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded">{ride.notes}</p>
              </div>
            )}
          </div>

          {/* Booking Requests - visible to ride owner */}
          {isDriver && bookings.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Requests ({bookings.length})</h3>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <BookingRequestCard 
                    key={booking._id} 
                    booking={booking} 
                    onAccept={handleAcceptBooking}
                    onReject={handleRejectBooking}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-4">Driver</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">
                {ride.creator?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <Link to={`/users/${ride.creator?._id}`} className="font-medium text-gray-900 hover:text-indigo-600">{ride.creator?.name}</Link>
                <p className="text-sm text-gray-500">Rating: {ride.creator?.rating > 0 ? `${ride.creator.rating.toFixed(1)} ⭐` : 'New'}</p>
              </div>
            </div>
            {!isDriver && user && (
              <button onClick={handleMessageDriver} className="w-full mb-6 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">Message Driver</button>
            )}

            {!isDriver ? (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Book a Seat</h3>
                {isAvailable && ride.status === 'active' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Seats</label>
                      <select 
                        value={seatsRequested} 
                        onChange={(e) => setSeatsRequested(Number(e.target.value))}
                        className="input-field mt-1"
                      >
                        {[...Array(ride.availableSeats)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{(priceDisplay * seatsRequested).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handleBook} 
                      disabled={bookingLoading} 
                      className="btn-primary w-full"
                    >
                      {bookingLoading ? 'Requesting...' : 'Request to Book'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-4 rounded text-center">
                    {ride.status !== 'active' ? 'This ride is no longer active.' : 'This ride is fully booked.'}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t pt-6">
                <Link to="/my-rides" className="btn-primary w-full block text-center">Manage Your Ride</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;

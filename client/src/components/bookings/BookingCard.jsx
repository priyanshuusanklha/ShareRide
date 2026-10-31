import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking, onCancel, onPay }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
  };

  const originDisplay = booking.ride?.origin?.address || booking.ride?.origin || 'Unknown';
  const destDisplay = booking.ride?.destination?.address || booking.ride?.destination || 'Unknown';
  const pricePerSeat = booking.ride?.pricePerSeat ?? booking.ride?.price ?? 0;
  const totalPrice = pricePerSeat * booking.seatsRequested;
  const rideId = booking.ride?._id || booking.ride;

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="text-lg font-semibold">{originDisplay} → {destDisplay}</h4>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] || statusColors.pending}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          {booking.ride?.date ? format(new Date(booking.ride.date), 'MMM d, yyyy') : 'Date TBD'} • {booking.seatsRequested} seat(s) • ₹{totalPrice.toFixed(2)}
        </p>
        {booking.ride?.driver?.name && (
          <p className="text-gray-400 text-xs mt-1">Driver: {booking.ride.driver.name}</p>
        )}
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3 w-full sm:w-auto">
        <Link to={`/rides/${rideId}`} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm text-center flex-1 sm:flex-none">View Ride</Link>
        {(booking.status === 'pending' || booking.status === 'accepted') && onCancel && (
          <button onClick={() => onCancel(booking._id)} className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">Cancel</button>
        )}
        {booking.status === 'accepted' && onPay && (
          <button onClick={() => onPay(booking._id)} className="btn-primary flex-1 sm:flex-none text-sm">Pay Now</button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

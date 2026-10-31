import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaUser, FaStar } from 'react-icons/fa';

const RideCard = ({ ride }) => {
  const originDisplay = ride.origin?.address || ride.origin || 'Unknown';
  const destDisplay = ride.destination?.address || ride.destination || 'Unknown';
  const priceDisplay = ride.pricePerSeat ?? ride.price ?? 0;
  const timeDisplay = ride.departureTime || ride.time || '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{originDisplay} → {destDisplay}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {ride.date ? format(new Date(ride.date), 'MMM d, yyyy') : 'Date TBD'}{timeDisplay ? ` at ${timeDisplay}` : ''}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-indigo-600">₹{priceDisplay}</span>
            <p className="text-sm text-gray-500">per seat</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FaUser />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{ride.creator?.name || 'Driver'}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FaStar className="text-yellow-400 mr-1" size={14} />
                <span>{ride.creator?.rating > 0 ? ride.creator.rating.toFixed(1) : 'New'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              ride.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {ride.availableSeats > 0 ? `${ride.availableSeats} seats left` : 'Full'}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link to={`/rides/${ride._id}`} className="w-full btn-primary text-center block">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RideCard;

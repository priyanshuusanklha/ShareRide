import React from 'react';

const BookingRequestCard = ({ booking, onAccept, onReject }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
          {booking.passenger?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="font-medium text-gray-900">{booking.passenger?.name || 'Passenger'}</p>
          <p className="text-sm text-gray-500">Requested {booking.seatsRequested} seat(s)</p>
        </div>
      </div>
      
      {booking.status === 'pending' ? (
        <div className="flex space-x-2">
          <button onClick={() => onReject(booking._id)} className="btn text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1">Reject</button>
          <button onClick={() => onAccept(booking._id)} className="btn-primary px-3 py-1">Accept</button>
        </div>
      ) : (
        <span className="text-sm font-medium text-gray-500 capitalize">{booking.status}</span>
      )}
    </div>
  );
};

export default BookingRequestCard;

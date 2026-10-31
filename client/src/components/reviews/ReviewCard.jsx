import React from 'react';
import StarRating from '../common/StarRating';
import { format } from 'date-fns';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
            {review.reviewer?.name?.charAt(0) || 'U'}
          </div>
          <span className="font-medium text-gray-900">{review.reviewer?.name || 'Anonymous'}</span>
        </div>
        <span className="text-xs text-gray-500">
          {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : ''}
        </span>
      </div>
      <div className="mb-2">
        <StarRating rating={review.rating} readonly size={16} />
      </div>
      <p className="text-gray-700 text-sm">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;

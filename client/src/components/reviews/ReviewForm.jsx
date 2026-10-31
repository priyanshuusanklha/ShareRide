import React, { useState } from 'react';
import StarRating from '../common/StarRating';

const ReviewForm = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-lg font-medium mb-4">Leave a Review</h4>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} readonly={false} size={24} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea 
          required
          rows="3" 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          className="input-field"
          placeholder="Share your experience..."
        ></textarea>
      </div>
      <button type="submit" disabled={isLoading || rating === 0} className="btn-primary w-full">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;

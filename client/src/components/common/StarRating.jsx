import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange, readonly = true, size = 20 }) => {
  const [hover, setHover] = React.useState(null);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className={readonly ? 'cursor-default' : 'cursor-pointer'}>
            {!readonly && (
              <input
                type="radio"
                name="rating"
                className="hidden"
                value={ratingValue}
                onClick={() => onRatingChange && onRatingChange(ratingValue)}
              />
            )}
            <FaStar
              size={size}
              color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e5e7eb"}
              onMouseEnter={() => !readonly && setHover(ratingValue)}
              onMouseLeave={() => !readonly && setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;

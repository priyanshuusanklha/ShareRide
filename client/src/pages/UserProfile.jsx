import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { getUserReviews } from '../api/reviews';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewCard from '../components/reviews/ReviewCard';
import StarRating from '../components/common/StarRating';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, reviewsData] = await Promise.all([
          getUserProfile(id),
          getUserReviews(id)
        ]);
        setProfile(profileData);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="p-8"><ErrorMessage message={error} /></div>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-lg shadow mb-8 text-center">
        <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-4xl font-bold mx-auto mb-4">
          {profile.name?.charAt(0)}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
        <div className="flex items-center justify-center mt-2 text-gray-600">
          <StarRating rating={profile.rating || 0} readonly />
          <span className="ml-2 font-medium">{profile.rating > 0 ? profile.rating.toFixed(1) : 'New'} ({profile.totalReviews} reviews)</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

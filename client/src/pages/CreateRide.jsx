import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RideForm from '../components/rides/RideForm';
import { createRide } from '../api/rides';
import toast from 'react-hot-toast';

const CreateRide = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const ride = await createRide(data);
      toast.success('Ride created successfully!');
      navigate(`/rides/${ride._id || ride.id}`);
    } catch (error) {
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error(error.response?.data?.error || 'Failed to create ride');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Offer a Ride</h1>
      <p className="text-gray-600 mb-8">Fill out the details below to share your journey and split the costs.</p>
      
      <RideForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateRide;

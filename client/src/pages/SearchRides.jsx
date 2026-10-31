import React, { useState, useEffect } from 'react';
import RideFilters from '../components/rides/RideFilters';
import RideCard from '../components/rides/RideCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { searchRides } from '../api/rides';

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRides = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRides(filters);
      setRides(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Ride</h1>
      
      <RideFilters onFilter={fetchRides} />
      
      {loading ? (
        <Loading message="Searching for rides..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchRides()} />
      ) : rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map(ride => (
            <RideCard key={ride._id} ride={ride} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No rides found" 
          description="We couldn't find any rides matching your criteria. Try adjusting your filters or search again later."
          actionText="Clear Filters"
          onAction={() => fetchRides()}
        />
      )}
    </div>
  );
};

export default SearchRides;

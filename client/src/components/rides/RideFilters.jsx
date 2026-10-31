import React, { useState } from 'react';

const RideFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    minSeats: '',
    maxPrice: '',
    sortBy: 'date'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <input type="text" name="origin" placeholder="Origin" value={filters.origin} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <input type="text" name="destination" placeholder="Destination" value={filters.destination} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <input type="date" name="date" value={filters.date} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <input type="number" name="minSeats" placeholder="Min Seats" min="1" value={filters.minSeats} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <input type="number" name="maxPrice" placeholder="Max Price" min="0" value={filters.maxPrice} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <button type="submit" className="btn-primary w-full h-full">Search</button>
        </div>
      </div>
    </form>
  );
};

export default RideFilters;

import React, { useState } from 'react';

const RideForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    from: '',
    to: '',
    date: '',
    departureTime: '',
    availableSeats: 1,
    pricePerSeat: 0,
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehiclePlate: '',
    pickupInstructions: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      from: formData.from,
      to: formData.to,
      date: formData.date,
      departureTime: formData.departureTime,
      availableSeats: Number(formData.availableSeats),
      pricePerSeat: Number(formData.pricePerSeat),
      vehicle: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        color: formData.vehicleColor,
        plateNumber: formData.vehiclePlate
      },
      pickupInstructions: formData.pickupInstructions,
      notes: formData.notes
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">From</label>
          <input required type="text" name="from" value={formData.from} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Mumbai" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input required type="text" name="to" value={formData.to} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Pune" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input required type="date" name="date" value={formData.date} onChange={handleChange} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input required type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Seats</label>
          <input required type="number" min="1" max="10" name="availableSeats" value={formData.availableSeats} onChange={handleChange} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Seat (₹)</label>
          <input required type="number" min="0" step="0.01" name="pricePerSeat" value={formData.pricePerSeat} onChange={handleChange} className="input-field mt-1" />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Make</label>
            <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Toyota" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Camry" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Silver" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">License Plate</label>
            <input type="text" name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} className="input-field mt-1" placeholder="e.g. MH-01-AB-1234" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pickup Instructions</label>
          <input type="text" name="pickupInstructions" value={formData.pickupInstructions} onChange={handleChange} className="input-field mt-1" placeholder="e.g. Meet at the north gate" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="input-field mt-1" placeholder="Any additional info for passengers..."></textarea>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto">
          {isLoading ? 'Saving...' : 'Publish Ride'}
        </button>
      </div>
    </form>
  );
};

export default RideForm;

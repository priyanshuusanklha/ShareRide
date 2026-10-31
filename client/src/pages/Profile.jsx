import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    vehicleMake: user?.vehicle?.make || '',
    vehicleModel: user?.vehicle?.model || '',
    vehicleColor: user?.vehicle?.color || '',
    vehiclePlate: user?.vehicle?.plateNumber || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        vehicle: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          color: formData.vehicleColor,
          plateNumber: formData.vehiclePlate
        }
      };
      await updateProfile(payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
        
        <div className="flex items-center space-x-6 mb-8">
          <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-3xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-medium">{user?.name}</h3>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field mt-1" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
            <input type="email" value={user?.email || ''} readOnly className="input-field mt-1 bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field mt-1" rows="3" placeholder="Tell us about yourself..."></textarea>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                <input type="text" name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} className="input-field mt-1" placeholder="e.g. XYZ-1234" />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

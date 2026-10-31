import api from './axios';

export const createBooking = async (data) => {
  const response = await api.post('/bookings', data);
  return response.data.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data.data; // Backend returns { success, count, data: bookings[] }
};

export const getRideBookings = async (rideId) => {
  const response = await api.get(`/bookings/ride/${rideId}`);
  return response.data.data;
};

export const acceptBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/accept`);
  return response.data.data;
};

export const rejectBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/reject`);
  return response.data.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data.data;
};

export const initiatePayment = async (id) => {
  const response = await api.put(`/bookings/${id}/pay`);
  return response.data.data;
};

export const verifyPayment = async (id, data) => {
  const response = await api.put(`/bookings/${id}/verify-payment`, data);
  return response.data.data;
};

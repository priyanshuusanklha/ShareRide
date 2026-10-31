import api from './axios';

export const createReview = async (data) => {
  const response = await api.post('/reviews', data);
  return response.data.data;
};

export const getUserReviews = async (userId) => {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data.data; // Backend returns { success, count, data: reviews[] }
};

export const getRideReviews = async (rideId) => {
  const response = await api.get(`/reviews/ride/${rideId}`);
  return response.data.data;
};

export const updateReview = async (id, data) => {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

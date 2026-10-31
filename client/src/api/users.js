import api from './axios';

export const getUserProfile = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data; // Backend returns { success, data: user }
};

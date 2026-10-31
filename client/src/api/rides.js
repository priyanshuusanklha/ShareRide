import api from './axios';

export const searchRides = async (filters) => {
  const { data } = await api.get('/rides', { params: filters });
  return data.data; // Backend returns { success, count, pagination, data: rides[] }
};

export const getRide = async (id) => {
  const { data } = await api.get(`/rides/${id}`);
  return data.data; // Backend returns { success, data: ride }
};

export const createRide = async (rideData) => {
  const { data } = await api.post('/rides', rideData);
  return data.data;
};

export const updateRide = async (id, rideData) => {
  const { data } = await api.put(`/rides/${id}`, rideData);
  return data.data;
};

export const deleteRide = async (id) => {
  const { data } = await api.delete(`/rides/${id}`);
  return data;
};

export const getMyRides = async () => {
  const { data } = await api.get('/rides/my/rides');
  return data.data; // Backend returns { success, count, data: rides[] }
};

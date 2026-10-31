import api from './axios';

export const createOrGetChat = async (data) => {
  const response = await api.post('/chat', data);
  return response.data.data;
};

export const getMyChats = async () => {
  const response = await api.get('/chat');
  return response.data.data; // Backend returns { success, count, data: chats[] }
};

export const getChatMessages = async (chatId) => {
  const response = await api.get(`/chat/${chatId}`);
  return response.data.data; // Backend returns { success, count, data: messages[] }
};

export const sendMessage = async (chatId, data) => {
  const response = await api.post(`/chat/${chatId}/messages`, data);
  return response.data.data;
};

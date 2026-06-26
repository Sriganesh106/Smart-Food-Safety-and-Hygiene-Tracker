import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Restaurants
export const getRestaurants = (params) => api.get('/restaurants', { params });
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (formData) =>
  api.post('/restaurants', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateRestaurant = (id, formData) =>
  api.put(`/restaurants/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

// Reviews
export const createReview = (restaurantId, data) =>
  api.post(`/restaurants/${restaurantId}/reviews`, data);
export const deleteReview = (restaurantId, reviewId) =>
  api.delete(`/restaurants/${restaurantId}/reviews/${reviewId}`);

// Auth
export const signup = (data) => api.post('/users/signup', data);
export const login = (data) => api.post('/users/login', data);
export const logout = () => api.get('/users/logout');
export const getMe = () => api.get('/users/me');

// Chat
export const sendChatMessage = (messages) => api.post('/chat', { messages });

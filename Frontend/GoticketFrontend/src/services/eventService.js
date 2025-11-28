import api from "./api";

const API_URL = "/events";

export const createEvent = async (eventData) => {
  const response = await api.post(API_URL, eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`${API_URL}/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};

export const getAllEvents = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const getSeatsForEvent = async (eventId) => {
  const response = await api.get(`${API_URL}/${eventId}/seats`);
  return response.data;
};

export const getAvailableSeatsForEvent = async (eventId) => {
  const response = await api.get(`${API_URL}/${eventId}/seats/available`);
  return response.data;
};

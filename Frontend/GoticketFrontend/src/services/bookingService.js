import api from "./api";

const API_URL = "/bookings";

export const bookTickets = async (bookingData) => {
  const response = await api.post(API_URL, bookingData);
  return response.data;
};

export const cancelBooking = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};

export const getAllBookings = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const getBookingsForUser = async (userId) => {
  const response = await api.get(`${API_URL}/user/${userId}`);
  return response.data;
};

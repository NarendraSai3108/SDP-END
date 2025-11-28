import api from "./api";

// Use the correct /api/auth/login and /api/auth/register endpoints!
export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

// These are likely correct if your backend uses /api/users/:id
export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/api/users/${id}`);
};

export const getAllUsers = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

export const getUserByEmail = async (email) => {
  const response = await api.get(`/api/users/by-email`, { params: { email } });
  return response.data;
};
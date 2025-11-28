import api from "./api";

const addUser = (userData) => api.post("/admin/addUser", userData);

const addManager = (userData) => api.post("/admin/addManager", userData);

const getAllUsers = () => api.get("/admin/allUsers");

const deleteUser = (id) => api.delete(`/admin/delete/${id}`);

const checkExecution = () => api.get("/admin/check");

export default {
  addUser,
  addManager,
  getAllUsers,
  deleteUser,
  checkExecution,
};

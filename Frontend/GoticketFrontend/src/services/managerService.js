import api from "./api";

const createEvent = (eventData) => api.post("/manager/events", eventData);

const updateEvent = (id, eventData) =>
  api.put(`/manager/events/${id}`, eventData);

const deleteEvent = (id) => api.delete(`/manager/events/${id}`);

export default {
  createEvent,
  updateEvent,
  deleteEvent,
};

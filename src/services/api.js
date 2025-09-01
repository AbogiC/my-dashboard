import axios from "axios";

const API_BASE_URL = "http://192.168.0.184:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default {
  // User methods
  getUser(id) {
    return api.get(`/user/${id}`);
  },

  // Task methods
  getTasks(userId) {
    return api.get(`/tasks/${userId}`);
  },
  addTask(taskData) {
    return api.post("/tasks", taskData);
  },
  updateTask(id, taskData) {
    return api.put(`/tasks/${id}`, taskData);
  },
  deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  },

  // Event methods
  getEvents(userId) {
    return api.get(`/events/${userId}`);
  },
  addEvent(eventData) {
    return api.post("/events", eventData);
  },
  updateEvent(id, eventData) {
    return api.put(`/events/${id}`, eventData);
  },
  deleteEvent(id) {
    return api.delete(`/events/${id}`);
  },

  // Note methods
  getNotes(userId) {
    return api.get(`/notes/${userId}`);
  },
  saveNote(noteData) {
    return api.post("/notes", noteData);
  },

  // Stats methods
  getStats(userId) {
    return api.get(`/stats/${userId}`);
  },
};

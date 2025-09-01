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
  register(userData) {
    return api.post("/register", userData);
  },
  login(credentials) {
    return api.post("/login", credentials);
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

  // Course methods
  getCourses(userId) {
    return api.get(`/courses/${userId}`);
  },
  getCourse(userId, courseId) {
    return api.get(`/courses-lesson/${courseId}`);
  },
  getPublicCourses() {
    return api.get("/courses-public");
  },
  addCourse(courseData) {
    return api.post("/courses", courseData);
  },
  updateCourse(id, courseData) {
    return api.put(`/courses/${id}`, courseData);
  },
  deleteCourse(id) {
    return api.delete(`/courses/${id}`);
  },

  // Lesson methods
  getLessons(courseId) {
    return api.get(`/lessons/${courseId}`);
  },
  getLesson(courseId, lessonId) {
    return api.get(`/lessons/${courseId}/${lessonId}`);
  },
  addLesson(lessonData) {
    return api.post("/lessons", lessonData);
  },
  updateLesson(id, lessonData) {
    return api.put(`/lessons/${id}`, lessonData);
  },
  deleteLesson(id) {
    return api.delete(`/lessons/${id}`);
  },
};

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";

const DATABASE_TYPE = import.meta.env.VITE_DATABASE_TYPE || "mysql";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.184:3001/api";

let firebaseApp = null;
let db = null;
let api = null;

// Initialize Firebase if needed
if (DATABASE_TYPE === "firebase") {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    console.log("Connected to Firebase Firestore from frontend");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback to API
    api = axios.create({ baseURL: API_BASE_URL });
  }
} else {
  // Use API for MySQL
  api = axios.create({ baseURL: API_BASE_URL });
}

class DatabaseService {
  // User methods
  async getUser(id) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
      } catch (error) {
        console.error("Error getting user from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/user/${id}`).then((res) => res.data);
    }
  }

  async register(userData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { name, email } = userData;
        if (!name || !email) {
          throw new Error("Name and email are required");
        }

        // Check if user exists
        const existingQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const existingSnapshot = await getDocs(existingQuery);
        if (!existingSnapshot.empty) {
          throw new Error("User with this email already exists");
        }

        const userDoc = {
          name,
          email,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "users"), userDoc);
        const newUser = await getDoc(docRef);
        return { id: newUser.id, ...newUser.data() };
      } catch (error) {
        console.error("Error registering user with Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/register", userData).then((res) => res.data);
    }
  }

  async login(credentials) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { email } = credentials;
        const usersQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const querySnapshot = await getDocs(usersQuery);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
      } catch (error) {
        console.error("Error logging in with Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/login", credentials).then((res) => res.data);
    }
  }

  // Task methods
  async getTasks(userId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("user_id", "==", userId),
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(tasksQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting tasks from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/tasks/${userId}`).then((res) => res.data);
    }
  }

  async addTask(taskData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { user_id, text } = taskData;
        const taskDoc = {
          user_id,
          text,
          completed: false,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "tasks"), taskDoc);
        const newTask = await getDoc(docRef);
        return { id: newTask.id, ...newTask.data() };
      } catch (error) {
        console.error("Error adding task to Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/tasks", taskData).then((res) => res.data);
    }
  }

  async updateTask(id, taskData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, {
          text: taskData.text,
          completed: taskData.completed,
          updated_at: serverTimestamp(),
        });
        return { message: "Task updated successfully" };
      } catch (error) {
        console.error("Error updating task in Firebase:", error);
        throw error;
      }
    } else {
      return api.put(`/tasks/${id}`, taskData).then((res) => res.data);
    }
  }

  async deleteTask(id) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        await deleteDoc(doc(db, "tasks", id));
        return { message: "Task deleted successfully" };
      } catch (error) {
        console.error("Error deleting task from Firebase:", error);
        throw error;
      }
    } else {
      return api.delete(`/tasks/${id}`).then((res) => res.data);
    }
  }

  // Event methods
  async getEvents(userId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("user_id", "==", userId),
          orderBy("event_date", "asc"),
          orderBy("event_time", "asc")
        );
        const querySnapshot = await getDocs(eventsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting events from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/events/${userId}`).then((res) => res.data);
    }
  }

  async addEvent(eventData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { user_id, title, event_date, event_time, description } =
          eventData;
        const eventDoc = {
          user_id,
          title,
          event_date,
          event_time,
          description: description || null,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "events"), eventDoc);
        const newEvent = await getDoc(docRef);
        return { id: newEvent.id, ...newEvent.data() };
      } catch (error) {
        console.error("Error adding event to Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/events", eventData).then((res) => res.data);
    }
  }

  async updateEvent(id, eventData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { title, event_date, event_time, description } = eventData;
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, {
          title,
          event_date,
          event_time,
          description: description || null,
          updated_at: serverTimestamp(),
        });
        return { message: "Event updated successfully" };
      } catch (error) {
        console.error("Error updating event in Firebase:", error);
        throw error;
      }
    } else {
      return api.put(`/events/${id}`, eventData).then((res) => res.data);
    }
  }

  async deleteEvent(id) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        await deleteDoc(doc(db, "events", id));
        return { message: "Event deleted successfully" };
      } catch (error) {
        console.error("Error deleting event from Firebase:", error);
        throw error;
      }
    } else {
      return api.delete(`/events/${id}`).then((res) => res.data);
    }
  }

  // Note methods
  async getNotes(userId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const notesQuery = query(
          collection(db, "notes"),
          where("user_id", "==", userId),
          orderBy("updated_at", "desc")
        );
        const querySnapshot = await getDocs(notesQuery);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() };
        }
        return null;
      } catch (error) {
        console.error("Error getting notes from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/notes/${userId}`).then((res) => res.data);
    }
  }

  async saveNote(noteData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { user_id, content } = noteData;
        const existingNote = await this.getNotes(user_id);
        if (existingNote) {
          const noteRef = doc(db, "notes", existingNote.id);
          await updateDoc(noteRef, {
            content,
            updated_at: serverTimestamp(),
          });
          return { message: "Note updated successfully" };
        } else {
          const noteDoc = {
            user_id,
            content,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          await addDoc(collection(db, "notes"), noteDoc);
          return { message: "Note saved successfully" };
        }
      } catch (error) {
        console.error("Error saving note to Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/notes", noteData).then((res) => res.data);
    }
  }

  // Stats methods
  async getStats(userId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const statsQuery = query(
          collection(db, "stats"),
          where("user_id", "==", userId)
        );
        const querySnapshot = await getDocs(statsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting stats from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/stats/${userId}`).then((res) => res.data);
    }
  }

  // Course methods
  async getCourses(userId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          where("user_id", "==", userId),
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(coursesQuery);

        const courses = [];
        for (const courseDoc of querySnapshot.docs) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };

          // Count lessons
          const lessonsQuery = query(
            collection(db, "lessons"),
            where("course_id", "==", courseDoc.id)
          );
          const lessonsSnapshot = await getDocs(lessonsQuery);
          courseData.total_lessons = lessonsSnapshot.size;

          courses.push(courseData);
        }

        return courses;
      } catch (error) {
        console.error("Error getting courses from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/courses/${userId}`).then((res) => res.data);
    }
  }

  async getCourse(userId, courseId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (!courseDoc.exists()) {
          return null;
        }

        const course = { id: courseDoc.id, ...courseDoc.data() };

        // Get lessons
        const lessonsQuery = query(
          collection(db, "lessons"),
          where("course_id", "==", courseId),
          orderBy("lesson_order", "asc")
        );
        const lessonsSnapshot = await getDocs(lessonsQuery);
        course.lessons = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return course;
      } catch (error) {
        console.error("Error getting course from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/courses-lesson/${courseId}`).then((res) => res.data);
    }
  }

  async getPublicCourses() {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          where("is_public", "==", true),
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(coursesQuery);

        const courses = [];
        for (const courseDoc of querySnapshot.docs) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };

          // Get author name
          if (courseData.user_id) {
            try {
              const userDoc = await getDoc(
                doc(db, "users", courseData.user_id)
              );
              if (userDoc.exists()) {
                courseData.author_name = userDoc.data().name;
              }
            } catch (userError) {
              console.error("Error getting user data:", userError);
            }
          }

          // Get total lessons
          try {
            const lessonsQuery = query(
              collection(db, "lessons"),
              where("course_id", "==", courseDoc.id)
            );
            const lessonsSnapshot = await getDocs(lessonsQuery);
            courseData.total_lessons = lessonsSnapshot.size;
          } catch (lessonError) {
            console.error("Error getting lesson count:", lessonError);
            courseData.total_lessons = 0;
          }

          courses.push(courseData);
        }

        return courses;
      } catch (error) {
        console.error("Error getting public courses from Firebase:", error);
        throw error;
      }
    } else {
      return api.get("/courses-public").then((res) => res.data);
    }
  }

  async addCourse(courseData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { user_id, title, description, is_public } = courseData;
        const courseDoc = {
          user_id,
          title,
          description: description || null,
          is_public: is_public || false,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "courses"), courseDoc);
        const newCourse = await getDoc(docRef);
        return { id: newCourse.id, ...newCourse.data() };
      } catch (error) {
        console.error("Error adding course to Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/courses", courseData).then((res) => res.data);
    }
  }

  async updateCourse(id, courseData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { title, description, is_public } = courseData;
        const courseRef = doc(db, "courses", id);
        await updateDoc(courseRef, {
          title,
          description: description || null,
          is_public,
          updated_at: serverTimestamp(),
        });
        return { message: "Course updated successfully" };
      } catch (error) {
        console.error("Error updating course in Firebase:", error);
        throw error;
      }
    } else {
      return api.put(`/courses/${id}`, courseData).then((res) => res.data);
    }
  }

  async deleteCourse(id) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        await deleteDoc(doc(db, "courses", id));
        return { message: "Course deleted successfully" };
      } catch (error) {
        console.error("Error deleting course from Firebase:", error);
        throw error;
      }
    } else {
      return api.delete(`/courses/${id}`).then((res) => res.data);
    }
  }

  // Lesson methods
  async getLessons(courseId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const lessonsQuery = query(
          collection(db, "lessons"),
          where("course_id", "==", courseId),
          orderBy("lesson_order", "asc")
        );
        const querySnapshot = await getDocs(lessonsQuery);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error getting lessons from Firebase:", error);
        throw error;
      }
    } else {
      return api.get(`/lessons/${courseId}`).then((res) => res.data);
    }
  }

  async getLesson(courseId, lessonId) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const lessonDoc = await getDoc(doc(db, "lessons", lessonId));
        if (lessonDoc.exists() && lessonDoc.data().course_id === courseId) {
          return { id: lessonDoc.id, ...lessonDoc.data() };
        }
        return null;
      } catch (error) {
        console.error("Error getting lesson from Firebase:", error);
        throw error;
      }
    } else {
      return api
        .get(`/lessons/${courseId}/${lessonId}`)
        .then((res) => res.data);
    }
  }

  async addLesson(lessonData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { course_id, title, content, lesson_order } = lessonData;
        const lessonDoc = {
          course_id,
          title,
          content: content || null,
          lesson_order: lesson_order || 0,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "lessons"), lessonDoc);
        const newLesson = await getDoc(docRef);
        return { id: newLesson.id, ...newLesson.data() };
      } catch (error) {
        console.error("Error adding lesson to Firebase:", error);
        throw error;
      }
    } else {
      return api.post("/lessons", lessonData).then((res) => res.data);
    }
  }

  async updateLesson(id, lessonData) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        const { title, content, lesson_order } = lessonData;
        const lessonRef = doc(db, "lessons", id);
        await updateDoc(lessonRef, {
          title,
          content: content || null,
          lesson_order: lesson_order || 0,
          updated_at: serverTimestamp(),
        });
        return { message: "Lesson updated successfully" };
      } catch (error) {
        console.error("Error updating lesson in Firebase:", error);
        throw error;
      }
    } else {
      return api.put(`/lessons/${id}`, lessonData).then((res) => res.data);
    }
  }

  async deleteLesson(id) {
    if (DATABASE_TYPE === "firebase" && db) {
      try {
        await deleteDoc(doc(db, "lessons", id));
        return { message: "Lesson deleted successfully" };
      } catch (error) {
        console.error("Error deleting lesson from Firebase:", error);
        throw error;
      }
    } else {
      return api.delete(`/lessons/${id}`).then((res) => res.data);
    }
  }
}

export default new DatabaseService();

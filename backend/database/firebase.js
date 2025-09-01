const { initializeApp } = require("firebase/app");
const {
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
} = require("firebase/firestore");
const config = require("../config/database");

class FirebaseDatabase {
  constructor() {
    const app = initializeApp(config.firebase);
    this.db = getFirestore(app);
    console.log("Connected to Firebase Firestore");
  }

  // User methods
  async getUser(id) {
    try {
      const userDoc = await getDoc(doc(this.db, "users", id));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  // Login user
  async loginUser(email) {
    try {
      const usersQuery = query(
        collection(this.db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(usersQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null; // User not found
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // Register new user
  async registerUser(name, email) {
    if (!name || !email) {
      throw new Error("Name and email are required");
    }
    try {
      // Check if user with the same email already exists
      const existingUserQuery = query(
        collection(this.db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(existingUserQuery);
      if (!querySnapshot.empty) {
        throw new Error("User with this email already exists");
      }
      // Add new user
      const userData = {
        name,
        email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      const docRef = await addDoc(collection(this.db, "users"), userData);
      const newUser = await getDoc(docRef);
      return { id: newUser.id, ...newUser.data() };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  // Task methods
  async getTasks(userId) {
    try {
      const tasksQuery = query(
        collection(this.db, "tasks"),
        where("user_id", "==", userId),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(tasksQuery);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting tasks:", error);
      throw error;
    }
  }

  async addTask(userId, text) {
    try {
      const taskData = {
        user_id: userId,
        text: text,
        completed: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      const docRef = await addDoc(collection(this.db, "tasks"), taskData);
      const newTask = await getDoc(docRef);
      return { id: newTask.id, ...newTask.data() };
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  }

  async updateTask(id, data) {
    try {
      const taskRef = doc(this.db, "tasks", id);
      await updateDoc(taskRef, {
        text: data.text,
        completed: data.completed,
        updated_at: serverTimestamp(),
      });
      return { message: "Task updated successfully" };
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      await deleteDoc(doc(this.db, "tasks", id));
      return { message: "Task deleted successfully" };
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  // Event methods
  async getEvents(userId) {
    try {
      const eventsQuery = query(
        collection(this.db, "events"),
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
      console.error("Error getting events:", error);
      throw error;
    }
  }

  async addEvent(eventData) {
    try {
      const { user_id, title, event_date, event_time, description } = eventData;
      const eventDoc = {
        user_id,
        title,
        event_date,
        event_time,
        description: description || null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      const docRef = await addDoc(collection(this.db, "events"), eventDoc);
      const newEvent = await getDoc(docRef);
      return { id: newEvent.id, ...newEvent.data() };
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  }

  async updateEvent(id, eventData) {
    try {
      const { title, event_date, event_time, description } = eventData;
      const eventRef = doc(this.db, "events", id);
      await updateDoc(eventRef, {
        title,
        event_date,
        event_time,
        description: description || null,
        updated_at: serverTimestamp(),
      });
      return { message: "Event updated successfully" };
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      await deleteDoc(doc(this.db, "events", id));
      return { message: "Event deleted successfully" };
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Note methods
  async getNotes(userId) {
    try {
      const notesQuery = query(
        collection(this.db, "notes"),
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
      console.error("Error getting notes:", error);
      throw error;
    }
  }

  async saveNote(userId, content) {
    try {
      const existingNote = await this.getNotes(userId);
      if (existingNote) {
        // Update existing note
        const noteRef = doc(this.db, "notes", existingNote.id);
        await updateDoc(noteRef, {
          content,
          updated_at: serverTimestamp(),
        });
        return { message: "Note updated successfully" };
      } else {
        // Create new note
        const noteData = {
          user_id: userId,
          content,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        await addDoc(collection(this.db, "notes"), noteData);
        return { message: "Note saved successfully" };
      }
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  }

  // Stats methods
  async getStats(userId) {
    try {
      const statsQuery = query(
        collection(this.db, "stats"),
        where("user_id", "==", userId)
      );
      const querySnapshot = await getDocs(statsQuery);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  }
}

module.exports = FirebaseDatabase;

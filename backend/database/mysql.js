const mysql = require("mysql2");
const config = require("../config/database");

class MySQLDatabase {
  constructor() {
    this.connection = mysql.createConnection(config.mysql);
    this.connect();
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
      }
      console.log("Connected to MySQL database");
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // User methods
  async getUser(id) {
    const results = await this.query("SELECT * FROM users WHERE id = ?", [id]);
    return results[0] || null;
  }

  // Login user
  async loginUser(email) {
    const results = await this.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results.length > 0) {
      return results[0]; // User exists, return user data
    } else {
      return null; // User not found
    }
  }

  // Register new user
  async registerUser(name, email) {
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    const existingUser = await this.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }

    const result = await this.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    const userResults = await this.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    return userResults[0];
  }

  // Task methods
  async getTasks(userId) {
    return await this.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
  }

  async addTask(userId, text) {
    const result = await this.query(
      "INSERT INTO tasks (user_id, text) VALUES (?, ?)",
      [userId, text]
    );
    const taskResults = await this.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    return taskResults[0];
  }

  async updateTask(id, data) {
    await this.query("UPDATE tasks SET text = ?, completed = ? WHERE id = ?", [
      data.text,
      data.completed,
      id,
    ]);
    return { message: "Task updated successfully" };
  }

  async deleteTask(id) {
    await this.query("DELETE FROM tasks WHERE id = ?", [id]);
    return { message: "Task deleted successfully" };
  }

  // Event methods
  async getEvents(userId) {
    return await this.query(
      "SELECT * FROM events WHERE user_id = ? ORDER BY event_date, event_time ASC",
      [userId]
    );
  }

  async addEvent(eventData) {
    const { user_id, title, event_date, event_time, description } = eventData;
    const result = await this.query(
      "INSERT INTO events (user_id, title, event_date, event_time, description) VALUES (?, ?, ?, ?, ?)",
      [user_id, title, event_date, event_time, description || null]
    );
    const eventResults = await this.query("SELECT * FROM events WHERE id = ?", [
      result.insertId,
    ]);
    return eventResults[0];
  }

  async updateEvent(id, eventData) {
    const { title, event_date, event_time, description } = eventData;
    const result = await this.query(
      "UPDATE events SET title = ?, event_date = ?, event_time = ?, description = ? WHERE id = ?",
      [title, event_date, event_time, description || null, id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Event not found");
    }
    return { message: "Event updated successfully" };
  }

  async deleteEvent(id) {
    const result = await this.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error("Event not found");
    }
    return { message: "Event deleted successfully" };
  }

  // Note methods
  async getNotes(userId) {
    const results = await this.query(
      "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
      [userId]
    );
    return results[0] || null;
  }

  async saveNote(userId, content) {
    const existingNote = await this.getNotes(userId);
    if (existingNote) {
      await this.query("UPDATE notes SET content = ? WHERE user_id = ?", [
        content,
        userId,
      ]);
      return { message: "Note updated successfully" };
    } else {
      await this.query("INSERT INTO notes (user_id, content) VALUES (?, ?)", [
        userId,
        content,
      ]);
      return { message: "Note saved successfully" };
    }
  }

  // Stats methods
  async getStats(userId) {
    return await this.query("SELECT * FROM stats WHERE user_id = ?", [userId]);
  }

  // Course methods
  async getCourses(userId) {
    return await this.query(
      `SELECT c.*, COUNT(l.id) AS total_lessons FROM courses c LEFT JOIN lessons l ON l.course_id = c.id WHERE c.user_id = ${userId} GROUP BY c.id ORDER BY c.created_at DESC;`,
      [userId]
    );
  }

  async getPublicCourses() {
    let query =
      "SELECT c.*, u.name as author_name, COUNT(l.id) AS total_lessons FROM courses c JOIN users u ON c.user_id = u.id LEFT JOIN lessons l ON l.course_id = c.id WHERE c.is_public = true GROUP BY c.id ORDER BY c.created_at DESC";
    let params = [];
    return await this.query(query, params);
  }

  async getCourseWithLessons(courseId) {
    const courseResults = await this.query(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );

    if (courseResults.length === 0) {
      return null;
    }

    const course = courseResults[0];
    const lessonResults = await this.query(
      "SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC",
      [courseId]
    );

    course.lessons = lessonResults;
    return course;
  }

  async addCourse(userId, title, description, isPublic = false) {
    const result = await this.query(
      "INSERT INTO courses (user_id, title, description, is_public) VALUES (?, ?, ?, ?)",
      [userId, title, description || null, isPublic]
    );
    const courseResults = await this.query(
      "SELECT * FROM courses WHERE id = ?",
      [result.insertId]
    );
    return courseResults[0];
  }

  async updateCourse(id, title, description, isPublic) {
    const result = await this.query(
      "UPDATE courses SET title = ?, description = ?, is_public = ? WHERE id = ?",
      [title, description || null, isPublic, id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Course not found");
    }
    return { message: "Course updated successfully" };
  }

  async deleteCourse(id) {
    const result = await this.query("DELETE FROM courses WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error("Course not found");
    }
    return { message: "Course deleted successfully" };
  }

  // Lesson methods
  async getLessons(courseId) {
    return await this.query(
      "SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC",
      [courseId]
    );
  }

  async getLesson(courseId, lessonId) {
    const results = await this.query(
      "SELECT * FROM lessons WHERE id = ? AND course_id = ?",
      [lessonId, courseId]
    );
    return results[0] || null;
  }

  async addLesson(courseId, title, content, lessonOrder) {
    const result = await this.query(
      "INSERT INTO lessons (course_id, title, content, lesson_order) VALUES (?, ?, ?, ?)",
      [courseId, title, content || null, lessonOrder || 0]
    );
    const lessonResults = await this.query(
      "SELECT * FROM lessons WHERE id = ?",
      [result.insertId]
    );
    return lessonResults[0];
  }

  async updateLesson(id, title, content, lessonOrder) {
    const result = await this.query(
      "UPDATE lessons SET title = ?, content = ?, lesson_order = ? WHERE id = ?",
      [title, content || null, lessonOrder || 0, id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Lesson not found");
    }
    return { message: "Lesson updated successfully" };
  }

  async deleteLesson(id) {
    const result = await this.query("DELETE FROM lessons WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error("Lesson not found");
    }
    return { message: "Lesson deleted successfully" };
  }

  close() {
    this.connection.end();
  }
}

module.exports = MySQLDatabase;

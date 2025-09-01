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

  close() {
    this.connection.end();
  }
}

module.exports = MySQLDatabase;

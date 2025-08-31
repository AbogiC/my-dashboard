const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get user data
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || {});
  });
});

// Get tasks for a user
app.get("/api/tasks/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { user_id, text } = req.body;
  db.query(
    "INSERT INTO tasks (user_id, text) VALUES (?, ?)",
    [user_id, text],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.query(
        "SELECT * FROM tasks WHERE id = ?",
        [results.insertId],
        (err, taskResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(taskResults[0]);
        }
      );
    }
  );
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { text, completed } = req.body;
  db.query(
    "UPDATE tasks SET text = ?, completed = ? WHERE id = ?",
    [text, completed, taskId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Task deleted successfully" });
  });
});

// Get events for a user
app.get("/api/events/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM events WHERE user_id = ? ORDER BY event_date, event_time ASC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Add a new event
app.post("/api/events", (req, res) => {
  const { user_id, title, event_date, event_time, description } = req.body;

  // Validate required fields
  if (!user_id || !title || !event_date || !event_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO events (user_id, title, event_date, event_time, description) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, event_date, event_time, description || null],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      // Return the newly created event
      db.query(
        "SELECT * FROM events WHERE id = ?",
        [results.insertId],
        (err, eventResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(eventResults[0]);
        }
      );
    }
  );
});

// Update an event
app.put("/api/events/:id", (req, res) => {
  const eventId = req.params.id;
  const { title, event_date, event_time, description } = req.body;

  if (!title || !event_date || !event_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "UPDATE events SET title = ?, event_date = ?, event_time = ?, description = ? WHERE id = ?",
    [title, event_date, event_time, description || null, eventId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event updated successfully" });
    }
  );
});

// Delete an event
app.delete("/api/events/:id", (req, res) => {
  const eventId = req.params.id;

  db.query("DELETE FROM events WHERE id = ?", [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  });
});

// Get notes for a user
app.get("/api/notes/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0] || {});
    }
  );
});

// Save/update a note
app.post("/api/notes", (req, res) => {
  const { user_id, content } = req.body;

  // Check if note exists for user
  db.query(
    "SELECT * FROM notes WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        // Update existing note
        db.query(
          "UPDATE notes SET content = ? WHERE user_id = ?",
          [content, user_id],
          (err, updateResults) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Note updated successfully" });
          }
        );
      } else {
        // Create new note
        db.query(
          "INSERT INTO notes (user_id, content) VALUES (?, ?)",
          [user_id, content],
          (err, insertResults) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Note saved successfully" });
          }
        );
      }
    }
  );
});

// Get stats for a user
app.get("/api/stats/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM stats WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

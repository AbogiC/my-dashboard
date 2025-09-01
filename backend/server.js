const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
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

// Register a new user
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Create new user
    db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
      (err, insertResults) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Get the newly created user
        db.query(
          "SELECT * FROM users WHERE id = ?",
          [insertResults.insertId],
          (err, userResults) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json(userResults[0]);
          }
        );
      }
    );
  });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json(results[0]);
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

// Get courses for a user
app.get("/api/courses/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Get a specific course with its lessons
app.get("/api/courses/:userId/:courseId", (req, res) => {
  const { userId, courseId } = req.params;
  db.query(
    "SELECT * FROM courses WHERE id = ? AND user_id = ?",
    [courseId, userId],
    (err, courseResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (courseResults.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Get lessons for this course
      db.query(
        "SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC",
        [courseId],
        (err, lessonResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const course = courseResults[0];
          course.lessons = lessonResults;
          res.json(course);
        }
      );
    }
  );
});

// Create a new course
app.post("/api/courses", (req, res) => {
  const { user_id, title, description } = req.body;

  if (!user_id || !title) {
    return res.status(400).json({ error: "User ID and title are required" });
  }

  db.query(
    "INSERT INTO courses (user_id, title, description) VALUES (?, ?, ?)",
    [user_id, title, description || null],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.query(
        "SELECT * FROM courses WHERE id = ?",
        [results.insertId],
        (err, courseResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(courseResults[0]);
        }
      );
    }
  );
});

// Update a course
app.put("/api/courses/:id", (req, res) => {
  const courseId = req.params.id;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  db.query(
    "UPDATE courses SET title = ?, description = ? WHERE id = ?",
    [title, description || null, courseId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ message: "Course updated successfully" });
    }
  );
});

// Delete a course
app.delete("/api/courses/:id", (req, res) => {
  const courseId = req.params.id;

  db.query("DELETE FROM courses WHERE id = ?", [courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  });
});

// Get lessons for a course
app.get("/api/lessons/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  db.query(
    "SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC",
    [courseId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Get a specific lesson
app.get("/api/lessons/:courseId/:lessonId", (req, res) => {
  const { courseId, lessonId } = req.params;
  db.query(
    "SELECT * FROM lessons WHERE id = ? AND course_id = ?",
    [lessonId, courseId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.json(results[0]);
    }
  );
});

// Create a new lesson
app.post("/api/lessons", (req, res) => {
  const { course_id, title, content, lesson_order } = req.body;

  if (!course_id || !title) {
    return res.status(400).json({ error: "Course ID and title are required" });
  }

  db.query(
    "INSERT INTO lessons (course_id, title, content, lesson_order) VALUES (?, ?, ?, ?)",
    [course_id, title, content || null, lesson_order || 0],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.query(
        "SELECT * FROM lessons WHERE id = ?",
        [results.insertId],
        (err, lessonResults) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(lessonResults[0]);
        }
      );
    }
  );
});

// Update a lesson
app.put("/api/lessons/:id", (req, res) => {
  const lessonId = req.params.id;
  const { title, content, lesson_order } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  db.query(
    "UPDATE lessons SET title = ?, content = ?, lesson_order = ? WHERE id = ?",
    [title, content || null, lesson_order || 0, lessonId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.json({ message: "Lesson updated successfully" });
    }
  );
});

// Delete a lesson
app.delete("/api/lessons/:id", (req, res) => {
  const lessonId = req.params.id;

  db.query("DELETE FROM lessons WHERE id = ?", [lessonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted successfully" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} and accessible from network`);
});

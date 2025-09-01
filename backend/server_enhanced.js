const express = require("express");
const cors = require("cors");
const DatabaseFactory = require("./database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database based on configuration
let db;
try {
  db = DatabaseFactory.createDatabase();
} catch (error) {
  console.error("Database initialization error:", error.message);
  console.log("Falling back to MySQL...");
  // Fallback to MySQL if configuration is invalid
  const config = require("./config/database");
  config.databaseType = "mysql";
  db = DatabaseFactory.createDatabase();
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Get user data
app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.getUser(userId);
    res.json(user || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a new user
app.post("/api/register", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await db.registerUser(name, email);

    res.json(user);
  } catch (error) {
    if (error.message === "User with this email already exists") {
      return res.status(409).json({ error: error.message });
    } else if (error.message === "Name and email are required") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await db.loginUser(email);

    if (user === null) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks for a user
app.get("/api/tasks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await db.getTasks(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { user_id, text } = req.body;
    const task = await db.addTask(user_id, text);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { text, completed } = req.body;
    const result = await db.updateTask(taskId, { text, completed });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const result = await db.deleteTask(taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events for a user
app.get("/api/events/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await db.getEvents(userId);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new event
app.post("/api/events", async (req, res) => {
  try {
    const { user_id, title, event_date, event_time, description } = req.body;

    // Validate required fields
    if (!user_id || !title || !event_date || !event_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await db.addEvent({
      user_id,
      title,
      event_date,
      event_time,
      description,
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update an event
app.put("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, event_date, event_time, description } = req.body;

    if (!title || !event_date || !event_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.updateEvent(eventId, {
      title,
      event_date,
      event_time,
      description,
    });
    res.json(result);
  } catch (error) {
    if (error.message === "Event not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete an event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const result = await db.deleteEvent(eventId);
    res.json(result);
  } catch (error) {
    if (error.message === "Event not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get notes for a user
app.get("/api/notes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const note = await db.getNotes(userId);
    res.json(note || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save/update a note
app.post("/api/notes", async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const result = await db.saveNote(user_id, content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats for a user
app.get("/api/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await db.getStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database info endpoint
app.get("/api/database-info", (req, res) => {
  const config = require("./config/database");
  res.json({
    databaseType: config.databaseType,
    message: `Currently using ${config.databaseType} database`,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Enhanced server running on port ${PORT} and accessible from network`
  );
  console.log(`Database type: ${require("./config/database").databaseType}`);
});

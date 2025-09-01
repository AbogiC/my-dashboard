const express = require("express");
const cors = require("cors");
const DatabaseFactory = require("./database");
require("dotenv").config();

const app = express();
const PORT = 3002; // Use different port for testing

// Initialize database based on configuration
let db;
try {
  db = DatabaseFactory.createDatabase();
  console.log(
    `✅ Database initialized: ${require("./config/database").databaseType}`
  );
} catch (error) {
  console.error("❌ Database initialization error:", error.message);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Test endpoint to check database info
app.get("/test/database-info", (req, res) => {
  const config = require("./config/database");
  res.json({
    databaseType: config.databaseType,
    message: `Currently using ${config.databaseType} database`,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint to check database connection
app.get("/test/connection", async (req, res) => {
  try {
    const testUserId = "test_user_123";
    const user = await db.getUser(testUserId);
    const tasks = await db.getTasks(testUserId);
    const events = await db.getEvents(testUserId);
    const notes = await db.getNotes(testUserId);
    const stats = await db.getStats(testUserId);

    res.json({
      status: "success",
      message: "Database connection and operations working",
      databaseType: require("./config/database").databaseType,
      testResults: {
        user: user ? "found" : "not found",
        tasks: tasks.length,
        events: events.length,
        notes: notes ? "found" : "not found",
        stats: stats.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      databaseType: require("./config/database").databaseType,
    });
  }
});

// Test endpoint to add a test task
app.post("/test/add-task", async (req, res) => {
  try {
    const testUserId = "test_user_123";
    const taskText = `Test task - ${new Date().toISOString()}`;
    const task = await db.addTask(testUserId, taskText);

    res.json({
      status: "success",
      message: "Test task added successfully",
      task: task,
      databaseType: require("./config/database").databaseType,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      databaseType: require("./config/database").databaseType,
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n=== Test Server Running ===`);
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Database type: ${require("./config/database").databaseType}`);
  console.log(`\n📋 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/test/database-info`);
  console.log(`   GET  http://localhost:${PORT}/test/connection`);
  console.log(`   POST http://localhost:${PORT}/test/add-task`);
  console.log(`\n💡 To test different databases:`);
  console.log(`   1. Change DATABASE_TYPE in .env file`);
  console.log(`   2. Restart this test server`);
  console.log(`   3. Call the test endpoints again`);
});

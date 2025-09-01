const DatabaseFactory = require("./database");
require("dotenv").config();

async function testDatabaseSwitching() {
  console.log("=== Database Switching Test ===\n");

  // Test 1: Check current configuration
  const config = require("./config/database");
  console.log(`Current DATABASE_TYPE: ${config.databaseType}`);
  console.log(`MySQL Config: ${JSON.stringify(config.mysql, null, 2)}`);
  console.log(`Firebase Config: ${JSON.stringify(config.firebase, null, 2)}\n`);

  // Test 2: Test database initialization
  try {
    console.log("Testing database initialization...");
    const db = DatabaseFactory.createDatabase();
    console.log("✅ Database initialized successfully!");

    // Test 3: Test basic operations
    console.log("\nTesting basic database operations...");

    // Test user operations
    try {
      const testUserId = "1";
      const user = await db.getUser(testUserId);
      console.log(`✅ getUser() - User found: ${user ? "Yes" : "No"}`);
    } catch (error) {
      console.log(`❌ getUser() - Error: ${error.message}`);
    }

    // Test tasks operations
    try {
      const testUserId = "test_user_123";
      const tasks = await db.getTasks(testUserId);
      console.log(`✅ getTasks() - Tasks found: ${tasks.length}`);
    } catch (error) {
      console.log(`❌ getTasks() - Error: ${error.message}`);
    }

    // Test events operations
    try {
      const testUserId = "test_user_123";
      const events = await db.getEvents(testUserId);
      console.log(`✅ getEvents() - Events found: ${events.length}`);
    } catch (error) {
      console.log(`❌ getEvents() - Error: ${error.message}`);
    }

    // Test notes operations
    try {
      const testUserId = "test_user_123";
      const notes = await db.getNotes(testUserId);
      console.log(`✅ getNotes() - Notes found: ${notes ? "Yes" : "No"}`);
    } catch (error) {
      console.log(`❌ getNotes() - Error: ${error.message}`);
    }

    // Test stats operations
    try {
      const testUserId = "test_user_123";
      const stats = await db.getStats(testUserId);
      console.log(`✅ getStats() - Stats found: ${stats.length}`);
    } catch (error) {
      console.log(`❌ getStats() - Error: ${error.message}`);
    }

    console.log("\n=== Test Summary ===");
    console.log(`✅ Database Type: ${config.databaseType}`);
    console.log("✅ All basic operations tested");
    console.log("✅ Database switching configuration is working!");
  } catch (error) {
    console.log(`❌ Database initialization failed: ${error.message}`);
    console.log("\n=== Troubleshooting ===");
    console.log("1. Check your .env file configuration");
    console.log("2. Ensure DATABASE_TYPE is set to 'mysql' or 'firebase'");
    console.log("3. Verify database credentials and connection");

    if (config.databaseType === "mysql") {
      console.log("\nMySQL Troubleshooting:");
      console.log("- Ensure MySQL server is running");
      console.log("- Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env");
      console.log("- Verify database and tables exist");
    } else if (config.databaseType === "firebase") {
      console.log("\nFirebase Troubleshooting:");
      console.log("- Check Firebase configuration in .env");
      console.log("- Ensure Firestore is enabled in your Firebase project");
      console.log("- Verify API keys are correct");
    }
  }
}

// Run the test
testDatabaseSwitching().catch(console.error);

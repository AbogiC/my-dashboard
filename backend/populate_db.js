const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const config = require("./config/database");

const connection = mysql.createConnection(config.mysql);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Read the SQL file
const sqlFile = path.join(__dirname, "database.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

// Split the SQL into individual statements
const statements = sql.split(";").filter((stmt) => stmt.trim().length > 0);

async function runStatements() {
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await new Promise((resolve, reject) => {
          connection.query(statement, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        console.log("Executed:", statement.substring(0, 50) + "...");
      } catch (error) {
        console.error("Error executing statement:", error.message);
      }
    }
  }
  console.log("Database populated successfully");
  connection.end();
}

runStatements().catch(console.error);

const config = require("../config/database");
const MySQLDatabase = require("./mysql");
const FirebaseDatabase = require("./firebase");

class DatabaseFactory {
  static createDatabase() {
    switch (config.databaseType.toLowerCase()) {
      case "mysql":
        console.log("Using MySQL database");
        return new MySQLDatabase();
      case "firebase":
        console.log("Using Firebase Firestore database");
        return new FirebaseDatabase();
      default:
        throw new Error(`Unsupported database type: ${config.databaseType}`);
    }
  }
}

module.exports = DatabaseFactory;

require("dotenv").config();

const DATABASE_TYPE = process.env.DATABASE_TYPE || "mysql"; // "mysql" or "firebase"

const config = {
  databaseType: DATABASE_TYPE,

  // MySQL Configuration
  mysql: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "tester",
    database: process.env.DB_NAME || "my_dashboard",
  },

  // Firebase Configuration
  firebase: {
    apiKey:
      process.env.FIREBASE_API_KEY || "AIzaSyAb64GAJalwOZnO_c90_gamgX69DAi0_Nw",
    authDomain:
      process.env.FIREBASE_AUTH_DOMAIN || "dasbor-diri.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "dasbor-diri",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "dasbor-diri.firebasestorage.app",
    messagingSenderId:
      process.env.FIREBASE_MESSAGING_SENDER_ID || "158656797370",
    appId:
      process.env.FIREBASE_APP_ID ||
      "1:158656797370:web:9df0913b032f5591550083",
  },
};

module.exports = config;

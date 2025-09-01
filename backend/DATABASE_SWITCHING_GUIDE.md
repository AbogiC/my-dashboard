# Database Switching Guide

This backend now supports both MySQL and Firebase Firestore databases. You can easily switch between them without changing your code.

## Quick Start

### 1. Create Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
# Set to "mysql" or "firebase"
DATABASE_TYPE=mysql

# MySQL Configuration (used when DATABASE_TYPE=mysql)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dashboard_db

# Firebase Configuration (used when DATABASE_TYPE=firebase)
FIREBASE_API_KEY=AIzaSyAb64GAJalwOZnO_c90_gamgX69DAi0_Nw
FIREBASE_AUTH_DOMAIN=dasbor-diri.firebaseapp.com
FIREBASE_PROJECT_ID=dasbor-diri
FIREBASE_STORAGE_BUCKET=dasbor-diri.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=158656797370
FIREBASE_APP_ID=1:158656797370:web:9df0913b032f5591550083

# Server Configuration
PORT=3001
```

### 2. Choose Your Server

You have two options:

#### Option A: Use Original Server (MySQL Only)

```bash
npm run dev          # Development mode
npm start           # Production mode
```

#### Option B: Use Enhanced Server (MySQL + Firebase)

```bash
npm run dev-enhanced    # Development mode
npm run start-enhanced  # Production mode
```

## Switching Database Types

### To use MySQL:

1. Set `DATABASE_TYPE=mysql` in your `.env` file
2. Ensure MySQL is running and accessible
3. Make sure your database and tables exist

### To use Firebase Firestore:

1. Set `DATABASE_TYPE=firebase` in your `.env` file
2. Ensure your Firebase project is set up with Firestore enabled
3. The collections will be created automatically when you first add data

## Database Structure

### MySQL Tables

- `users` - User information
- `tasks` - User tasks
- `events` - User events
- `notes` - User notes
- `stats` - User statistics

### Firebase Collections

- `users` - User documents
- `tasks` - Task documents
- `events` - Event documents
- `notes` - Note documents
- `stats` - Stat documents

## API Endpoints

All API endpoints remain the same regardless of database type:

- `GET /api/user/:id` - Get user data
- `GET /api/tasks/:userId` - Get user tasks
- `POST /api/tasks` - Add new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/events/:userId` - Get user events
- `POST /api/events` - Add new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/notes/:userId` - Get user notes
- `POST /api/notes` - Save/update note
- `GET /api/stats/:userId` - Get user stats

### Enhanced Server Only

- `GET /api/database-info` - Get current database type

## Installation

Install the required dependencies:

```bash
npm install
```

## Usage Examples

### Check Current Database

```bash
curl http://localhost:3001/api/database-info
```

### Switch Database

1. Edit your `.env` file
2. Change `DATABASE_TYPE` to your desired database
3. Restart the server

## Migration Between Databases

### From MySQL to Firebase

1. Set `DATABASE_TYPE=firebase` in `.env`
2. Restart the enhanced server
3. Your data will be stored in Firebase Firestore

### From Firebase to MySQL

1. Set `DATABASE_TYPE=mysql` in `.env`
2. Ensure MySQL is running with proper tables
3. Restart the enhanced server
4. Your data will be stored in MySQL

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**

   - Check your Firebase configuration in `.env`
   - Ensure Firestore is enabled in your Firebase project
   - Verify your API keys are correct

2. **MySQL Connection Error**

   - Check your MySQL configuration in `.env`
   - Ensure MySQL server is running
   - Verify database and tables exist

3. **Fallback to MySQL**
   - If Firebase configuration is invalid, the server will automatically fallback to MySQL
   - Check the console logs for error messages

### Error Messages

- `"Unsupported database type"` - Check your `DATABASE_TYPE` in `.env`
- `"Database initialization error"` - Check your database configuration
- `"Event not found"` - The requested record doesn't exist

## Development vs Production

### Development

- Use `npm run dev-enhanced` for enhanced server with hot reload
- Use `npm run dev` for original MySQL-only server

### Production

- Use `npm run start-enhanced` for enhanced server
- Use `npm start` for original MySQL-only server

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use environment variables for sensitive information
- Firebase API keys are safe to expose in client-side code, but server-side keys should be kept secure

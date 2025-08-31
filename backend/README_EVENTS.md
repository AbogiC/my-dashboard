# Events System Setup Guide

## Overview

This guide explains how to set up the events system in your dashboard backend to store events in MySQL database.

## Database Setup

### 1. Create/Update Database Schema

Run the main database schema:

```bash
mysql -u your_username -p < database.sql
```

### 2. If you have an existing database, run the migration:

```bash
mysql -u your_username -p < migrate_events.sql
```

## Database Structure

The `events` table has the following structure:

```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    event_time TIME NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoints

### GET /api/events/:userId

- **Purpose**: Retrieve all events for a specific user
- **Response**: Array of events ordered by date and time

### POST /api/events

- **Purpose**: Create a new event
- **Body**:
  ```json
  {
    "user_id": 1,
    "title": "Meeting Title",
    "event_date": "2024-01-15",
    "event_time": "14:00:00",
    "description": "Optional description"
  }
  ```
- **Response**: The newly created event object

### PUT /api/events/:id

- **Purpose**: Update an existing event
- **Body**: Same as POST
- **Response**: Success message

### DELETE /api/events/:id

- **Purpose**: Delete an event
- **Response**: Success message

## Testing the API

### 1. Start your backend server:

```bash
cd backend
npm start
```

### 2. Test with curl:

```bash
# Create an event
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Test Meeting",
    "event_date": "2024-01-15",
    "event_time": "15:00:00",
    "description": "This is a test event"
  }'

# Get events for user 1
curl http://localhost:3001/api/events/1
```

## Frontend Integration

The frontend is already configured to use these endpoints through the `api.js` service. The calendar component will automatically:

1. Fetch events when the component loads
2. Display events on the calendar with blue dots
3. Allow adding new events through the modal
4. Show event details when clicking on calendar dates

## Troubleshooting

### Common Issues:

1. **Database Connection Error**: Check your MySQL credentials in `.env` file
2. **Table Not Found**: Run the database.sql script first
3. **Column Missing**: Run the migrate_events.sql script
4. **CORS Error**: Ensure your frontend is running on the correct port

### Check Database Connection:

```bash
mysql -u your_username -p -e "USE my_dashboard; SHOW TABLES;"
```

### Verify Events Table:

```bash
mysql -u your_username -p -e "USE my_dashboard; DESCRIBE events;"
```

## Sample Data

The database.sql file includes sample events for testing. You can modify these or add your own events through the API.

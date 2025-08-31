-- Migration script to add description column to events table
-- Run this if you already have an events table without the description column

USE my_dashboard;

-- Add description column to existing events table
ALTER TABLE events ADD COLUMN description TEXT AFTER event_date;

-- Verify the table structure
DESCRIBE events;

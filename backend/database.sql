CREATE DATABASE IF NOT EXISTS my_dashboard;
USE my_dashboard;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    event_time TIME NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    bg_color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Insert sample events
INSERT INTO events (user_id, title, event_date, event_time, description) VALUES 
(1, 'Team Standup', CURDATE(), '10:00:00', 'Daily team meeting to discuss progress and blockers'),
(1, 'Client Meeting', CURDATE(), '14:00:00', 'Meeting with client to discuss project requirements'),
(1, 'Project Review', CURDATE(), '16:30:00', 'Review project milestones and deliverables'),
(1, 'Code Review', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 'Review pull requests and code quality'),
(1, 'Planning Session', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', 'Plan next sprint tasks and priorities');
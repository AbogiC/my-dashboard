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

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    lesson_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Insert sample events
INSERT INTO events (user_id, title, event_date, event_time, description) VALUES
(1, 'Team Standup', CURDATE(), '10:00:00', 'Daily team meeting to discuss progress and blockers'),
(1, 'Client Meeting', CURDATE(), '14:00:00', 'Meeting with client to discuss project requirements'),
(1, 'Project Review', CURDATE(), '16:30:00', 'Review project milestones and deliverables'),
(1, 'Code Review', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 'Review pull requests and code quality'),
(1, 'Planning Session', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', 'Plan next sprint tasks and priorities');

-- Insert sample courses
INSERT INTO courses (user_id, title, description, is_public) VALUES
(1, 'Introduction to JavaScript', 'Learn the basics of JavaScript programming language', true),
(1, 'Web Development Fundamentals', 'Build your first website with HTML, CSS, and JavaScript', true),
(1, 'React for Beginners', 'Get started with React and build interactive web applications', true),
(1, 'Node.js Backend Development', 'Learn server-side JavaScript with Node.js and Express', true),
(1, 'Database Design Principles', 'Understand relational database design and SQL', true);
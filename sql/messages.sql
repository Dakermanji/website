--! sql/messages.sql

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique ID for each message
    user_id CHAR(36) NULL,                     -- Foreign key to link to the `users` table
    subject VARCHAR(100) NOT NULL,             -- Subject of the message
    message TEXT NOT NULL,                     -- Message content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the message is created
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE -- Foreign key constraint
);

--! sql/chat_messages.sql
CREATE TABLE chat_messages (
    id CHAR(36) PRIMARY KEY,
    project_name VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

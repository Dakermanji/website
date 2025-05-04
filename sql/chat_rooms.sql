--! sql/chat_rooms.sql
CREATE TABLE chat_rooms (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    creator_id CHAR(36) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

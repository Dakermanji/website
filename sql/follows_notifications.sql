-- ! sql/follows_notifications.sql
CREATE TABLE follows_notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    -- The user receiving the notification
    sender_id CHAR(36) NOT NULL,
    -- The user who initiated the follow action
    type ENUM(
        'follow_request',
        'follow_accepted',
        'follow_back'
    ) NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

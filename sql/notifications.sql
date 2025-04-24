-- ! sql/notifications.sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project VARCHAR(50) NOT NULL,
    -- e.g., 'taskmanager', 'chat_app'
    notifier_id CHAR(36) NULL,
    notified_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(255),
    -- NEW: link to related page (e.g., /taskmanager/:projectId)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notifier_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (notified_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ! sql/blocks.sql
CREATE TABLE blocks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    blocker_id CHAR(36) NOT NULL,
    blocked_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_block_pair (blocker_id, blocked_id),
    INDEX idx_block_relationship (blocker_id, blocked_id)
);

-- ! sql/follow_request_status.sql
CREATE TABLE follow_request_status (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO follow_request_status (status)
VALUES ('pending'),
    ('accepted'),
    ('declined'),
    ('blocked'),
    ('mutual request'),
    ('followed back'),
    ('canceled'),
    ('unfollowed'),
    ('blocked by receiver'),
    ('blocked by sender');

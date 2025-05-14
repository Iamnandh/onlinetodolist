DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL,
    scheduled_for DATETIME,
    completed BOOLEAN NOT NULL DEFAULT FALSE
); 
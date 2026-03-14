USE student_management_db;

DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_code VARCHAR(50) NOT NULL UNIQUE,
    event_name VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
    organizer VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
USE student_management_db;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    gender ENUM('male','female','other') NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    employment_status ENUM('active','inactive','terminated') DEFAULT 'active',
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
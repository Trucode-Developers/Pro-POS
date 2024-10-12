-- For PostgreSQL
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    -- id <?sqlite INTEGER PRIMARY KEY AUTOINCREMENT ?>
    -- <?postgres SERIAL PRIMARY KEY ?>,
    serial_number VARCHAR(255) NOT NULL UNIQUE,
    staff_number VARCHAR(255) NOT NULL UNIQUE DEFAULT '000000',
    branch_slug VARCHAR(255) NOT NULL UNIQUE DEFAULT 'main',
    profile_picture VARCHAR(255) NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255) NULL,
    id_no VARCHAR(255) NULL,
    date_of_birth TIMESTAMP NULL,
    gender VARCHAR(255) NULL,
    country INT NULL,
    location VARCHAR(255) NULL,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    status  BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT NULL,
    created_by VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_by INT NULL
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_serial_number VARCHAR(255) NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

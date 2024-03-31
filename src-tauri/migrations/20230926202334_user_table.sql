CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  role int NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE roles (
  id serial PRIMARY KEY,
  code varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  created_by int NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE permissions (
  id serial PRIMARY KEY,
  slug varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL
);

CREATE TABLE role_permissions (
  id serial PRIMARY KEY,
  role_id int NOT NULL,
  permission_id int NOT NULL,
  created_by int NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE user_roles (
  id serial PRIMARY KEY,
  user_id int NOT NULL,
  role_id int NOT NULL,
  created_by int NOT NULL,
  created_at timestamp NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

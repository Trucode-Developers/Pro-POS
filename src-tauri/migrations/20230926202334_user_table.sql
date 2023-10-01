CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  role int NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  is_active boolean NOT NULL
);

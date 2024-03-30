

CREATE TABLE branches (
  id serial PRIMARY KEY,
  code varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  address varchar(255) NULL,
  phone varchar(255) NULL ,
  email varchar(255) NULL,
  description text NULL,
  status boolean DEFAULT TRUE,
  created_by int NULL,
  created_at timestamp NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)

);


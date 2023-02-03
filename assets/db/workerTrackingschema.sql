--this will be where we build our db table for the schema

DROP DATABASE IF EXISTS worker_trackDB;
Create DATABASE worker_trackDB;
USE worker_trackDB;

--this will be the creation of the tables
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30),
    PRIMARY KEY(id)
); 

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id NOT NULL,
    FOREIGN KEY (department_id),
    REFERENCES department(id),
    PRIMARY KEY (id)
);
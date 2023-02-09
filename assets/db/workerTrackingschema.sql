
DROP DATABASE IF EXISTS worker_trackDB;
Create DATABASE worker_trackDB;
USE worker_trackDB;

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

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id),
    REFERENCES role(id),
FOREIGN KEY (manager_id),
REFERENCES role(id),
PRIMARY KEY (id)
);
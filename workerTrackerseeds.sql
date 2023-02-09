USE worker_trackDB;

INSERT INTO department (name)
VALUES ('Engineering'), ('Finance'), ('Sales'), ('Legal');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Seto", "Kaiba", 1, 1),
("Yugi", "Moto", 1, 1),
("Joey", "Wheeler",3, NULL),
("Duo", "Maxwell", 2, NULL),
("Billy", "Cranston", 2, 3),
("Eric", "Hernandez", 4, NULL),
("Kimberly", "Hart", 4, 6),
("Zach", "Taylor", 2,2);

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 180000, 2)
("Software Engineer", 160000, 2),
("Legal Team Senior", 190000, 4),
("Lawyer", 150000, 4),
("Sales Lead", 250000, 1),
("Sales Manager", 198000, 1),
("Accountant", 120000, 3);
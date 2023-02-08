const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');
const { rmSync } = require('fs');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'Protomansql5',
    database: 'worker_trackDB'
});

connection.connect((err) => {
if (err) {
    console.error(`could not connect: ${err.stack}`);
    return;
}
//call back const that will prompt the user with questions
questionaire(); 
});

//here is where we build the questions a user will be prompted.
const questionaire = () => {
    inquirer.prompt([{
        name: 'qA',
        type: 'list',
        message: 'What are ya gonna do?',
        choices: ['Display Departments', 'Display Roles', 'Display Personnel', 
        'Create Department', 'Create Role',
    'Create Employee', 'Update Employee Role'],
    }]).then((answer) => {
        switch(answer.qA){
            case 'Display Departments':
            displayDepartments();
            break;

            case 'Display Roles':
                displayRoles();
                break;

                case 'Display Personnel':
                    displayPersonnel();
                    break;

                    case 'Create Department':
                        createDepartment();
                    break;

                    case 'Create Role':
                        createRole();
                        break;

                        case 'Create Employee':
                            createEmployee();
                            break;

                            case 'Update Employee Role':
                                updateemployeeRole();
                                break;

                                default:
                                    break;
        }
    })
}

const displayDepartments = () => {
connection.query (`SELECT * FROM department`, (err, res) => {
console.table (res);
questionaire();
});
};

const displayRoles = () => {
    connection.query (`SELECT * FROM role`, (err, res) => {
    console.table (res);
    questionaire();
    });
    };

    const displayPersonnel = () => {
        connection.query (`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name',
        role.title AS Title, department.name AS Department,
        CONCAT('$', format(role.salary,0)) AS Salary, CONCAT(manager.first_name, '', 
        manager.last_name) AS Manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        ORDER BY employee.id ASC;
        `, (err, res) => {
console.table (res);
questionaire();
        });
    };

    const createDepartment = () => {
        inquirer.prompt ([{
            name: 'createDepartment',
            type: 'input',
            message: 'Enter Department Name?',
        }])
        .then ((answer) => {
            let sql = `INSERT INTO department (name) VALUES (?)`;
            connection.query (sql, answer.createDepartment, (err, res) => {
                displayDepartments();
            });
        });
    }

    const createEmployee = () => {
        let managers = [];
        let roles = [];

        connection.query (`SELECT * FROM role`, (err, res) => {
            res.forEach ((role) => {
                roles.push ({
                    'name': role.title,
                    'value': role.id
                });
            });
            connection.query (`SELECT * FROM employee`, (err, res) => {
                res.forEach ((employee) => {
                    managers.push ({
                        'name': employee.first_name + '' + employee.last_name
                    });
                });
                inquirer.prompt ([{
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter first name of Employee',
                },
                {
name: 'lastName',
type: 'input',
message: 'Enter last name of Employee',
                },
                {
name: 'role',
type: 'list',
message: 'Please select employee role',
choices: roles,
                },
                {
name: 'manager',
type: 'list',
message: 'Whom is the manager for employee?',
choices: managers,
                }
            ])
            .then ((answer) => {
                let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${parseInt(answer.role)})`
                connection.query (sql, (err, res) => {
                    displayPersonnel();
                });
            });
            });
        });
    }

    const createRole = () => {
        
    }
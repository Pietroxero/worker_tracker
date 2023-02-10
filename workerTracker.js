const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
// const { rmSync } = require('fs');

const connection = mysql.createConnection({
    host: 'localhost',
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
                let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${parseInt(answer.role)})`;
                connection.query (sql, (err, res) => {
                    displayPersonnel();
                });
            });
            });
        });
    }

    const createRole = () => {
        let departments = [];
connection.query (`SELECT * FROM department`, (err, res) => {
    res.forEach ((department) => {
        departments.push ({
            'name': department.name,
            'value': department.id
        });
    });
});
inquirer.prompt ([
    {
name: 'roleTitle',
tye: 'input',
message: 'Enter new role title'
    },
    {
        name: 'roleSalary',
        type: 'input',
        message: 'Enter salary range',
    },
    {
        name: 'departmentId',
        type: 'list',
        message: 'Which department is the role assigned to?',
        choices: departments,
    }
])
.then ((answer) => {
    departments.forEach ((department) => {
        if (department.value === answer.departmentId){
            let sql = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.roleTitle}', ${parseInt(answer.roleSalary)}, ${parseInt(answer.departmentId)})`;
            connection.query (sql, (err, res) => {
                displayRoles();
            });
        }
    });
});
    }

    const updateemployeeRole = () => {
let roles = [];
let employees = [];
connection.query (`SELECT * FROM employee`, ( err, res) => {
    res.forEach ((employee) => {
        employees.push ({
            'name': employee.first_name + '' + employee.last_name,
            'value': employee.id
        });
    });
    connection.query(`SELECT * FROM role`, (err, res) => {
        res.forEach ((role) => {
            roles.push ({
                'name': role.title,
                'value': role.id
            });
        });
        inquirer.prompt
        ([
            {
name: 'employee',
type: 'list',
message: 'Please select an employee to update role',
choices: employees,
            },
            {
name: 'role',
type: 'list',
message: 'Please select new role for employee',
choices: roles,
            }
        ])
        .then ((answer) => {
            employees.forEach ((employee) => {
if (employee.value ===answer.employee){
    let sql = `UPDATE employee Set employee.role_id = ? WHERE employee.id = ?`;
    connection.query (sql, [answer.role, answer.employee], (err, res) => {
        displayPersonnel();
    });
}
            });
        });
    });
});
    }
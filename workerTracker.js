const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');

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
        'Display specific Department', 'Display specific Role',
    'Display specific Employee', 'Display specific Employee Role'],
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

                    case 'Display specific Department':
                    displayspecificDepartment();
                    break;

                    case 'Display specific Role':
                        displayspecificRole();
                        break;

                        case 'Display specific Employee':
                            displayspecificEmployee();
                            break;

                            case 'Display specific Employee Role':
                                displayspecificemployeeRole();
                                break;

                                default:
                                    break;
        }
    })
}

const displayDepartments = () => {
connection.query(`SELECT * FROM department`, (err, res) => {
console.table(res);
questionaire();
});
};

const displayRoles = () => {
    connection.query(`SELECT * FROM role`, (err, res) => {
    console.table(res);
    questionaire();
    });
    };

    const displayPersonnel = () => {
        connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name',
        role.title AS Title, department.name AS Department,
        CONCAT('$', format(role.salary,0)) AS Salary, CONCAT(manager.first_name, '', 
        manager.last_name) AS Manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        ORDER BY employee.id ASC;
        `, (err, res) => {
console.table(res);
questionaire();
        });
    };

    
// import required modules and packages
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const figlet = require('figlet');
const chalk = require('chalk')



require('dotenv').config();

// select port to listen to
const PORT = process.env.PORT || 3001;
const app = express();



// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create connection to sql database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    (err) => {
        console.log('Something went wrong...');
        return;
    },
    console.log('listening on company_db')
);

// employee system message
figlet('              Employee\nManagement   System \n', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(chalk.cyan.bold(data))
});

// connect to server and db
connection.connect(function (err) {
    if (err) throw err;
    selectMenu();
});

function selectMenu() {
    inquirer
        .prompt({
            type: 'list',
            name: 'option',
            message: ' \nPlease select an option from the menu below\n \n',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'View department utilized budget',
                'Add a department',
                'Add a role',
                'Add a employee',
                'Update an employee role',
                'Delete a department',
                'Delete a role',
                'Delete an employee',              
                'Exit'
            ]
        }).then(function (answer) {
            switch (answer.option) {

                case 'View all departments':
                    viewDepartments();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmployees();
                    break;

                case 'View employees by manager':
                    viewEmployeesbyManager();
                    break;

                case 'View employees by department':
                    viewemployeesbyDepartment();
                    break;

                case 'View department utilized budget':
                    viewBudget();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update employee':
                    updateEmployee();
                    break;

                case 'Delete a department':
                    deleteEmployee();
                    break;

                case 'Delete a role':
                    deleteRole();
                    break;

                case 'Delete an employee':
                    deleteEmployee();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// view department from select menu
function viewDepartments() {
    const query = 'SELECT department.id As Department_ID, department.name As Department_Name FROM department'

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view roles from select menu
function viewRoles() {
    const query = `SELECT role.id AS Role_ID, role.title AS Role_Title, role.salary AS Salary, role.department_id AS Department_ID FROM role`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view employees from select menu
function viewEmployees() {
    const query = `SELECT employee.id AS Employee_ID, concat(employee.first_name, ' ', employee.last_name) AS Employee, employee.role_id AS Role_ID, employee.manager_id AS Reporting_Manager_ID FROM employee`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view employees by manger from select menu
function viewEmployeesbyManager() {
    const query = `SELECT concat(em2.first_name, " ", em2.last_name) AS Manager, concat(em1.first_name, " ",em1.last_name) AS Employee from employee em2
    LEFT JOIN employee em1 ON em1.manager_id=em2.id
    WHERE em1.manager_id IS NOT NULL
    ORDER BY em1.manager_id;`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view employees by department from select menu
function viewemployeesbyDepartment() {
    const query = `SELECT department.name AS Department, CONCAT(employee.first_name,' ' ,employee.last_name) AS Employee FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on department.id = role.department_id;`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view 
function viewBudget() {
    const query = `SELECT department.name AS Department,  sum(role.salary) AS Utilized_Budget
    FROM employee LEFT JOIN role on role.id = employee.role_id 
    LEFT JOIN department on department.id = role.department_id
    group by department.name;`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

        selectMenu();
    })
}

// view 
// function  add() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }

// // view 
// function  add() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }

// // view 
// function  add() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }

// // view 
// function  update() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }



// // delete
// function  delete() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }
// // delete
// function  delete() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }
// // delete
// function  delete() {
//     const query = ``

//     connection.query(query, function (err, res) {
//         if (err) throw err;

//         console.table(res);
//         console.log(chalk.black.bgGreenBright.bold('Command Successfull!'));

//         selectMenu();
//     })
// }
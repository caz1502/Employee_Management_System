// import required modules and packages
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
// const table = require('console.table');
const { printTable } = require('console-table-printer');
// const table = require('console-table-printer');
const figlet = require('figlet');
const chalk = require('chalk');
require('colors');
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

    console.log(chalk.black.bgGreenBright.bold('connected to company_db!'))
);

// employee system message

init = () => {
    figlet.text('Employee \nManagement System\n', {

        slant: '-f',
        font: 'crawford'

    }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log('');
        console.log(data.cyan);
        selectMenu();
    })
}

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
                'Add an employee',
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

                case 'Update an employee role':
                    updateEmployee();
                    break;

                case 'Delete a department':
                    deleteDepartment();
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
};

// view department from select menu
viewDepartments = () => {
    const query = 'SELECT department.id As Department_ID, department.name As Department_Name FROM department'
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
};

// view roles from select menu
viewRoles = () => {
    const query = `SELECT role.id AS Role_ID,  role.title AS Job_Title,  department.name As Owning_Department, role.salary AS Role_Salary
FROM role
LEFT JOIN department ON department.id=role.department_id;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
};

// view employees from select menu
viewEmployees = () => {
    const query =
    (`SELECT employee.id,
    CONCAT (employee.first_name, " ", employee.last_name) AS employee,
    role.title,
    department.name AS department ,
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`)
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
};

// view employees by manger from select menu
viewEmployeesbyManager = () => {
    const query = `SELECT concat(em2.first_name, " ", em2.last_name) AS Manager, concat(em1.first_name, " ",em1.last_name) AS Employee from employee em2
    LEFT JOIN employee em1 ON em1.manager_id=em2.id
    WHERE em1.manager_id IS NOT NULL
    ORDER BY em1.manager_id;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
};

// view employees by department from select menu
viewemployeesbyDepartment = () => {
    const query = `SELECT department.name AS Department, CONCAT(employee.first_name,' ' ,employee.last_name) AS Employee FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on department.id = role.department_id;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
};

// view spent budget oer department
viewBudget = () => {
    const query = `SELECT department.name AS Department,  sum(role.salary) AS Utilized_Budget
    FROM employee LEFT JOIN role on role.id = employee.role_id 
    LEFT JOIN department on department.id = role.department_id
    group by department.name;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        printTable(res);
        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
        selectMenu();
    })
}

// add department 
addDepartment = () => {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: `Enter new department name: `
            }
        ])
        .then(answer => {
            connection.query(`INSERT INTO department (name) VALUES (?)`, answer.department, (err, result) => {
                if (err) throw err;
                console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                selectMenu();
            })
        })
}

// add role 
addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: `Enter new role: `
            }
        ])
        .then(answer => {
            let arr = [answer.role]
            connection.query(`SELECT * FROM department`, (err, data) => {
                if (err) throw err;
                const departments = data.map(({ name, id }) => ({ name: name, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: "Which department does this role report into?",
                        choices: departments
                    }
                ])
                    .then(answer => {
                        arr.push(answer.name);
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'salary',
                                message: "What is the salary for this role? *** Remember the decimals***",
                            }
                        ])
                            .then(answer => {
                                arr.push(answer.salary);
                                connection.query(`INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)`, arr, (err, result) => {
                                    if (err) throw err;
                                    console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                                    selectMenu();
                                })
                            })
                    })
            })
        })

};

// add new employee

addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `Enter first name: `,
                validate: checkFirst => {
                    if (checkFirst) {
                        return true;
                    } else {
                        console.log('Please enter a first name'.red);
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: `Enter last name: `,
                validate: checkLast => {
                    if (checkLast) {
                        return true;
                    } else {
                        console.log('Please enter a last name'.red);
                        return false;
                    }
                }
            },
        ])
        .then((answer) => {
            const employee = [answer.firstName, answer.lastName]

            connection.promise().query(`SELECT role.id, role.title FROM role`)
                .then(([rows, fields]) => {
                    const role = rows.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message: `What is the employee's role?`,
                                choices: role
                            }
                        ])
                        .then(answer => {
                            employee.push(answer.role);
                            connection.promise().query(`SELECT * FROM employee`)
                                .then(([rows, fields]) => {
                                    const managers = rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'manager',
                                                message: `Who is the employee's manager?`,
                                                choices: managers
                                            }
                                        ])
                                        .then(answer => {
                                            employee.push(answer.manager);
                                            console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                                            selectMenu();
                                            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ? ,?)`, employee, (err, result) => {
                                                if (err) { throw err }
                                            })
                                        })
                                });
                        })
                });
        })
};

// delete department
deleteDepartment = () => {
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) throw err;

        const department = data.map(({ id, name }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which department would you like to delete?",
                choices: department
            }
        ])
            .then(answer => {
                connection.query(`DELETE FROM department WHERE id = ?`, answer.name, (err, result) => {
                    if (err) throw err;
                    console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                    selectMenu();
                });
            });
    });
};

// delete role
deleteRole = () => {
    connection.query(`SELECT * FROM role`, (err, data) => {
        if (err) throw err;
        const role = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which role would you like to delete?",
                choices: role
            }
        ])
            .then(answer => {
                connection.query(`DELETE FROM role WHERE id = ?`, answer.name, (err, result) => {
                    if (err) throw err;
                    console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                    selectMenu();

                });
            });
    });
};

// delete employee
deleteEmployee = () => {
    connection.query(`SELECT * FROM employee`, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(answer => {
                const employee = answer.name;
                connection.query(`DELETE FROM employee WHERE id = ?`, employee, (err, result) => {
                    if (err) throw err;
                    printTable(data);
                    console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                    selectMenu();

                });
            });
    });
};

updateEmployee= () => {
    connection.query(`SELECT * FROM employee`, (err, data) => {
        if (err) throw err; 
    
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
    
        inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee would you like to update?",
            choices: employees
        }
        ])
        .then(answer => {
            connection.query(`SELECT * FROM role`, (err, data) =>{
                if (err) throw err;
                const employee = answer.name;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: `What is the employee's new role?`,
                        choices: roles
                    }
                ])
                .then(answer => {
                    const role = answer.role;
                    const arr = [role,employee];
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, arr, (err, result) => {
                        if (err) throw err;
                        console.log(chalk.black.bgGreenBright.bold('\n', 'Command Successfull!', '\n'));
                        selectMenu();
                    })
                })
            })
        });
    });
}


init()


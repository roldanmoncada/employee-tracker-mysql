const { prompt } = require("inquirer");
require("console.table");
const logo = require('asciiart-logo');


const db = require('./db');
const { findAllEmployeesByDepartment, findAllDepartments } = require("./db");

init()

function init() {
    const logoText = logo({ name: 'Employee Manager'}).render()
    console.log(logoText)
    loadMainPrompts()
};

function loadMainPrompts() { 
    console.log('hey')
    prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'Pick your thing',
        choices: [
            {
                name: 'viewAllEmployees',
                value: 'VIEW_EMPLOYEES'
            },
            {
                name: 'viewAllEmployeesByDepartment',
                value: 'VIEW_ALL_EMPLOYEES_BY_DEPARTMENT'
            },
            {
                name: 'viewAllEmployeesByManager',
                value: 'VIEW_ALL_EMPLOYEES_BY_MANAGER'
            },
            {
                name: 'viewBudgets',
                value: 'VIEW_BUDGETS'
            },
            {
                name: 'viewRoles',
                value: 'VIEW_ROLES'
            },
            {
                name: 'createRole',
                value: 'CREATE_ROLE'
            },
            {
                name: 'quit',
                value: 'QUIT'
            }
        ]
   
        }
        
    ]).then((res) => { console.log('Hi')
        let choice = res.choice
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployees()
                break;
            case 'VIEW_ALL_EMPLOYEES_BY_DEPARTMENT':
                viewAllEmployeesByDepartment()
                break;
            case 'VIEW_ALL_DEPARTMENTS':
                viewDepartment()
                break;
            case 'VIEW_BUDGETS':
                viewBudgets()
                break;
            case 'VIEW_ROLES':
                viewRoles()
                break;
            case 'CREATE_ROLE':
                addRole()
                break;
             default: quit()
        }
    })
};

function viewEmployees() { console.log('Hi')
    db.findAllEmployees()
    .then(([rows]) => {
        let employee_db = rows;
        console.log('\n')
        console.table(employee_db)
    })
    .then(() => {
        loadMainPrompts();
    })
};

function viewAllEmployeesByDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let department = rows;
        console.log(department)
        const departmentChoices = department.map(({id, name}) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                type: 'list',
                name: 'departmentID',
                message: 'Which department would you like to see?',
                choices: departmentChoices
            }
        ]).then(res => db.findAllEmployeesByDepartment(res.departmentID))
        .then(([rows]) => {
            let employees = rows
            console.table(employees)
        }).then(() => loadMainPrompts())
    })
}

function viewDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let department = rows;
        console.table(department)
    }).then(() => loadMainPrompts())
}

function viewBudgets() {
    db.viewDepartmentBudgets()
    .then(([rows]) => {
        let department = rows;
        console.table(department)
    }).then(() => loadMainPrompts())
}

function viewRoles() {
    db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.table(roles)
    }).then(() => loadMainPrompts())
}

function addRole() {
    db.createRole()
    .then(([rows]) => {
        let department = rows;
        const departmentChoices = department.map(({id, name}) => ({
            name: name,
            value: id,
        }));
        prompt([
            {
                name: 'title',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                message: 'What salary would you like for this role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this new role belong to?',
                choices: departmentChoices
            }
        ]).then(role => {
            db.createRole(role)
            .then(() => {
                console.log(`Added ${role.title} into the database!`)
                .then(() => loadMainPrompts())
            })
        })
    })
}

function quit() {
    console.log('Goodbye!')
    process.exit()
};
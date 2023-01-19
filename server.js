const { prompt } = require("inquirer");
require("console.table");
const logo = require('asciiart-logo');


const db = require('./db');
const { findAllEmployeesByDepartment } = require("./db");

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
            case 'more pizza':
                console.log('amore pizza')
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
    db.findAllEmployeesByDepartment()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({id, name}) => ({
            name: name,
            value: id
        }));
        prompt([
            {
                type: 'list',
                name: 'departmentID',
                message: 'Which department would you like to see?',
                choice: departmentChoices
            }
        ]).then(res => db.findAllEmployeesByDepartment(res.departmentID))
        .then(([rows]) => {
            let employees = rows
            console.table(employees)
        }).then(() => loadMainPrompts())
    })
}

//function viewDepartment() {

// }


function quit() {
    console.log('Goodbye!')
    process.exit()
};
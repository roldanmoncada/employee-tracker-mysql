const { prompt } = require("inquirer");
require("console.table");
const logo = require('asciiart-logo');


const db = require('./db');

init()

function init() {
    const logoText = logo({ name: 'Employee Manager'}).render()
    console.log(logoText)
    loadMainPrompts()
};

function loadMainPrompts() {
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
                name: 'pizza',
                value: 'PIZZA'
            },
            {
                name: 'quit',
                value: 'QUIT'
            }
        ]
   
        }
        
    ]).then(res => {
        let choice = res.choice
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployees()
                break;
            case 'pizza':
                console.log('pizza')
                break;
             default: quit()
        }
    })
};

function viewEmployees() {
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

//function viewDepartment() {

// }


function quit() {
    console.log('Goodbye!')
    process.exit()
};
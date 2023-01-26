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
                name: 'Create Role',
                value: 'CREATE_ROLE'
            },
            {
                name: 'Create Employee',
                value: 'CREATE_EMPLOYEE'
            },
            {
                name: 'Delete Employee',
                value: 'DELETE_EMPLOYEE'
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
            case 'CREATE_EMPLOYEE':
                generateEmployee()
                break;
            case 'DELETE_EMPLOYEE':
                deleteEmployee()
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
    db.findAllDepartments()
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
            }).then(() => loadMainPrompts())
        })
    })
}

function generateEmployee() {
    prompt([
        {
            name: 'first_name',
            message: "What is the employee's first name?"
        },
        {
            name: 'last_name',
            message: "What is the employee's last name?"
        }
    ]).then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;
        db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({
                id,
                title,
            }) => ({
                name: title,
                value: id,
            }));
            prompt([
                {
                    type: 'list',
                    name: 'roleID',
                    message: 'What role do you want for this employee?',
                    choices: roleChoices
                }
            ]).then(res => {
                let roleID = res.roleID;
                db.findAllEmployees()
                .then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(({
                        id,
                        first_name,
                        last_name
                    }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }))
                    managerChoices.unshift({name: 'none', value: null})
                    prompt([
                        {
                            type: 'list',
                            name: 'managerID',
                            message: "Who is the employee's manager?",
                            choices: managerChoices
                        }
                    ]).then(res => {
                        let employee = {
                            manager_id: res.managerID,
                            role_id: roleID,
                            first_name: firstName,
                            last_name: lastName
                        }
                        db.createEmployee(employee)
                    }).then(() => {
                        console.log(`Added ${firstName} ${lastName}`)
                    }).then(() => loadMainPrompts())
                })
            })
        })
    })
}

function deleteEmployee() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({
            id, 
            first_name,
            last_name,
        }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        prompt([
            {
                type:'list',
                name: 'employeeID',
                message: 'What employee do you want to delete?',
                choices: employeeChoices
            }
        ]).then(res => {
            db.removeEmployee(res.employeeID)
        }).then(() => {
            console.log(`Deleted from the database!`)
        }).then(() => loadMainPrompts())
    })
}

function quit() {
    console.log('Goodbye!')
    process.exit()
};
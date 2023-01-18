const connection = require('./connection');

class DB {
    constructor (connection) {
        this.connection = connection;
    }
    findAllEmployees() {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager from employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;'
        );
    
    }

    findAllEmployeesByDepartment(departmentID) {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department department ON role.department_id = department.id WHERE department.id = ?;',
            departmentID
        );
    }

    findAllEmployeesByManager(managerID) {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department.id = role.department_id WHERE manager_id = ?;',
            managerID
        )
    }

    findAllPossibleManager(employeeID) {
        return this.connection.promise().query(
            'SELECT id, first_name, last_name FROM employee WHERE id !=?',
            employeeID
        )
    }
};

module.exports = new DB(connection);
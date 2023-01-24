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

    findAllEmployeesByDepartment(departmentId) {
        console.log(departmentId)
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;',
            departmentId
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

    findAllRoles() {
        return this.connection.promise().query(
            'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;'
        )
    }
    
    findAllDepartments() {
        return this.connection.promise().query(
            'SELECT department.id, department.name FROM department'
        )
    }

    createEmployee(employee) {
        return this.connection.promise().query(
            'INSERT INTO employee SET ?',
            employee
        )
    }

    createRole(role) {
        return this.connection.promise().query(
            'INSERT INTO role SET ?',
            role
        )
    }

    createDepartment(department) {
        return this.connection.promise().query(
            'INSERT INTO department SET ?',
            department
        )
    }

    updateEmployeeRole(employeeID, roleID) {
        return this.connection.promise().query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [employeeID, roleID]
        )
    }

    updateEmployeeManager(employeeID, managerID) {
        return this.connection.promise().query(
            'UPDATE employee SET manager_id = ? WHERE id = ?',
            [employeeID, managerID]
        )
    }

    viewDepartmentBudgets() {
        return this.connection.promise().query(
            'SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department.id, department.name;'
        )
    }

    removeEmployee(employeeID) {
        return this.connection.promise().query(
            'DELETE from employee WHERE id = ?',
            employeeID
        )
    }

      removeDepartment(departmentID) {
        return this.connection.promise().query(
            'DELETE from department WHERE id = ?',
            departmentID
        )
    }
};

module.exports = new DB(connection);
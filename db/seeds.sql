USE employee_db;

INSERT INTO department (name)
VALUES ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Marketing'),
        ('Custodial Arts');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 120000, 1),
        ('Engineer', 200000, 2),
        ('Financier', 150000, 3),
        ('Marketing Analyst', 100000, 4),
        ('Custodial Lead', 450000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jennifer', 'Smith', 1, NULL),
        ('Steven', 'Jorgensen', 2, NULL),
        ('Kyle', 'Chadsworth', 3, 1),
        ('Mikayla', 'Florp', 4, NULL),
        ('Bob', 'Goldman', 5, 2);

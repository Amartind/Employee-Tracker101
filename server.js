const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

function begin() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "begin",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((ans) => {
      if (ans.begin == "View All Employees") {
        // Show table with ID, FIRSTNAME, LASTNAME, TITLE, DEPARTMENT, SALARY, MANAGER
        db.query(
          "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;",
          (err, data) => {
            if (err) {
              throw err;
            } else {
              console.table(data);
              begin();
            }
          }
        );
      } else if (ans.begin == "Add Employee") {
        db.query("SELECT title FROM role", (err, data) => {
            if (err) {
              throw err;
            } else {
              let roleslist = [];
              for (let i = 0; i < data.length; i++) {
                roleslist.push(data[i].title);
              }
        db.query("SELECT first_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title IN ('Sales Lead', 'Lead Engineer', 'Account Manager', 'Legal Team Lead');", (err, data) => {
        if (err) {
          throw err;
        } else {
            firstnames= []
            firstnames.push("Null");
            for (let i = 0; i < data.length; i++) {
                firstnames.push(data[i].first_name);
                //   console.log(id);
            }
            // console.log(firstnames);
        }
   
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstname",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "lastname",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roleslist
              // TODO: how to display from database
            },
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's Manager?",
              choices: firstnames
              // TODO:how to display from database
            },
          ])
          .then((ans2) => {
            if (ans2.role == "Sales Lead") {
              ans2.role = 1;
            } else if (ans2.role == "Salesperson") {
              ans2.role = 2;
            } else if (ans2.role == "Lead Engineer") {
              ans2.role = 3;
            } else if (ans2.role == "Software Engineer") {
              ans2.role = 4;
            } else if (ans2.role == "Account Manager") {
              ans2.role = 5;
            } else if (ans2.role == "Accountant") {
              ans2.role = 6;
            } else if (ans2.role == "Legal Team Lead") {
              ans2.role = 7;
            } else if (ans2.role == "Lawyer") {
              ans2.role = 8;
            }
            if (ans2.manager == "Null") {
              ans2.manager = null;
            } else if (ans2.manager == "John") {
              ans2.manager = 1;
            } else if (ans2.manager == "Ashley") {
              ans2.manager = 2;
            } else if (ans2.manager == "Kunal") {
              ans2.manager = 3;
            } else if (ans2.manager == "Sarah") {
              ans2.manager = 4;
            }

            db.query(
              "INSERT INTO employee SET first_name=?, last_name=?, role_id=?, manager_id=?",
              [ans2.firstname, ans2.lastname, ans2.role, ans2.manager],
              (err) => {
                if (err) {
                  throw err;
                } else {
                  console.log("Employee Added");
                  begin();
                }
              }
            )}
            ) })}
    });

      } else if (ans.begin == "Update Employee Role") {
        db.query("SELECT title FROM role", (err, data) => {
          if (err) {
            throw err;
          } else {
            let roleslist = [];
            for (let i = 0; i < data.length; i++) {
              roleslist.push(data[i].title);
            }
            // console.log(roleslist);
            db.query("SELECT first_name FROM employee", (err, data) =>{
                if (err) throw err;
                let employees = [];
                for (let i = 0; i < data.length; i++) {
                  employees.push(
                    `${data[i].first_name}`
                  );
                }
                // console.log(employees);

                // Which employee do you want to update? list type with employees value
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "empchangerole",
                      message: "Which employee do you want to update?",
                      choices: employees
                      
                    },
                    {
                      type: "list",
                      name: "empchangerole2",
                      message:
                        "Which role do you want to assign the selected employee?",
                      choices: roleslist
                      
                    },
                  ])
                  // Which role do you want to assign the selected employee? list type with role values
                  .then((ans3) => {
                    
                    db.query("UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ? ) WHERE first_name = ?",[ans3.empchangerole2, ans3.empchangerole],(err, data) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Employee Role Changed");
                          begin();
                        }
                      }
                    );
                  });
              }
            );
          }
        });
      } else if (ans.begin == "View All Roles") {
        // Display all roles ID TITLE DEPARTMENT SALARY
        db.query(
          "SELECT role.id AS ID, role.title AS TITLE, department.name AS DEPARTMENT, role.salary AS SALARY FROM role JOIN department on role.department_id=department.id",
          (err, data) => {
            if (err) {
              throw err;
            } else {
                console.table(data);
                begin();
            }
          }
        );
      } else if (ans.begin == "Add Role") {
        db.query("SELECT * FROM department", (err, data) => {
            if (err) {
              throw err;
            } else {
              let names = [];
              let departmentidslist = [];
              
              for (let i = 0; i < data.length; i++) {
                names.push(data[i].name);
                departmentidslist.push(data[i].id);
                
              }
            //   console.log(names);
            
          
            inquirer
          .prompt([
            {
              type: "input",
              name: "nameinput",
              message: "What is the name of the role?",
            },
            {
              type: "input",
              name: "salaryinput",
              message: "What is the salary of the role?",
            },
            {
              type: "list",
              name: "departmentinput",
              message: "Which department does the role belong to?",
              choices: names
              
            },
          ])
          .then((ans4) => {
              
            db.query("INSERT INTO role SET title = ?, salary = ?, department_id = (SELECT id FROM department WHERE name = ?)",[ans4.nameinput,ans4.salaryinput,ans4.departmentinput],(err) => {
                if (err) {
                  throw err;
                } else {
                  console.log("Role inserted successfully!");
                  begin()
                }
              }
            );
          }
        );
      }})
     }
     else if (ans.begin == "View All Departments") {
        db.query("SELECT * FROM department", (err, data) => {
          if (err) {
            throw err;
          } else {
            console.table(data);
            begin();
          }
        });
        // Display all departments  ID and NAME
      } else if (ans.begin == "Add Department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "departmentinput",
              message: "What is the name of the Department?",
            },
          ])
          .then((ans5) => {
            db.query("INSERT INTO department SET name=?", [ans5.departmentinput],(err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Department Added");
                  begin();
                }
              });
          });
        //TODO:
        //inquire What is the name of the Department?
      } else if (ans.begin == "Quit") {
        console.log("Goodbye");
      }
    })}
begin();

function testarea() {
    db.query("UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ? ) WHERE first_name = ?",["Sales Lead", "John"], (err, data) =>{
          if (err) throw err;
          console.log(data);
        }
      );
}

// testarea();



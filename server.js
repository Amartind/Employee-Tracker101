const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table")
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }
);

function begin (){
inquirer.prompt([
    {
        type:"list",
        name:"begin",
        message:"What would you like to do?",
        choices:["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
])
    .then(ans => {
        if (ans.begin == "View All Employees"){
            // Show table with ID, FIRSTNAME, LASTNAME, TITLE, DEPARTMENT, SALARY, MANAGER
            db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;", (err,data) =>{
                    if(err){
                        throw err
                    } else{
                        console.table(data)
                        begin();
                    }
                
            })
        } else if (ans.begin == "Add Employee"){
            inquirer.prompt([
                {
                    type:"input",
                    name:"firstname",
                    message:"What is the employee's first name?"
                },
                {
                    type:"input",
                    name:"lastname",
                    message:"What is the employee's last name?"
                },
                {
                    type:"list",
                    name:"role",
                    message:"What is the employee's role?",
                    choices:["Sales Lead","Salesperson","Lead Engineer","Software Engineer","Account Manager","Accountant","Legal Team Lead","Lawyer"]
                    // TODO: how to display from database
                },
                {
                    type:"list",
                    name:"manager",
                    message:"Who is the employee's Manager?",
                    choices:["Null","John","Ashley","Kunal","Sarah"]
                    // TODO:how to display from database
                }
            ]).then(ans2 => {
                if (ans2.role == "Sales Lead"){
                    ans2.role = 1
                } else if(ans2.role == "Salesperson"){
                    ans2.role = 2
                } else if(ans2.role == "Lead Engineer"){
                    ans2.role = 3
                } else if(ans2.role == "Software Engineer"){
                    ans2.role = 4
                } else if(ans2.role == "Account Manager"){
                    ans2.role = 5
                } else if(ans2.role == "Accountant"){
                    ans2.role = 6
                } else if(ans2.role == "Legal Team Lead"){
                    ans2.role = 7
                } else if(ans2.role == "Lawyer"){
                    ans2.role = 8
                };
                if (ans2.manager == "Null"){
                    ans2.manager = null
                } else if(ans2.manager == "John"){
                    ans2.manager = 1
                } else if(ans2.manager == "Ashley"){
                    ans2.manager = 2
                } else if(ans2.manager == "Kunal"){
                    ans2.manager = 3
                } else if (ans2.manager == "Sarah"){
                    ans2.manager = 4
                }
                // TODO: changes every instance of employee. need to change one only
                db.query("UPDATE employee SET first_name=?, last_name=?, role_id=?, manager_id=?",[ans2.firstname, ans2.lastname, ans2.role, ans2.manager], (err,data)=>{
                    if (err){
                        throw err
                    } else {
                        console.table(data)
                        begin();
                    }
                })
                
            })
        } else if (ans.begin == "Update Employee Role"){
            // Which employee do you want to update? list type with employees value
            inquirer.prompt([
                {
                    type:"list",
                    name:"empchangerole",
                    message:"Which employee do you want to update?",
                    choices:[`${employee.first_name,employee.last_name}`]
                    // TODO: Put Values in from employee first last name 
                },
                {
                    type:"list",
                    name:"empchangerole2",
                    message:"Which role do you want to assign the selected employee?",
                    choices:[`${role.id}`]
                    // TODO: Put Values in from roles title 
                }
            ])
            // Which role do you want to assign the selected employee? list type with role values
            .then(ans3 =>{
                //TODO:
                db.query("update where role?",[ans3.empchangerole, ans3.empchangerole2],(err,data)=>{
                    if (err){
                        console.log(err)
                    } else{
                        console.table(data)
                        begin()
                    }
                })
            })
        } else if (ans.begin == "View All Roles"){
            // Display all roles ID TITLE DEPARTMENT SALARY
            db.query("SELECT role.id AS ID, role.title AS TITLE, department.name AS DEPARTMENT, role.salary AS SALARY FROM role JOIN department on role.department_id=department.id", (err,data) =>{
                if(err){
                    throw err
                } else{
                    console.table(data)
                    begin();
                }
            
        })
        } else if (ans.begin == "Add Role"){
            inquirer.prompt([
                {
                    type:"input",
                    name:"nameinput",
                    message:"What is the name of the role?"
                },
                {
                    type:"input",
                    name:"salaryinput",
                    message:"What is the salary of the role?"
                },
                {
                    type:"list",
                    name:"roleinput",
                    message:"Which department does the role belong to?",
                    choices:""
                    //TODO:
                }
            ]).then(ans4 =>{
                // TODO:
            })
            //TODO:
            // What is the name of the role?
            // What is the salary of the role?
            // Which department does the role belong to? list type
        } else if (ans.begin == "View All Departments"){
            db.query("SELECT * FROM department", (err,data) =>{
                if(err){
                    throw err
                } else{
                    console.table(data)
                    begin();
                }
            
        })
            // Display all departments  ID and NAME
        } else if (ans.begin == "Add Department"){
            inquirer.prompt([
                {
                    type:"input",
                    name:"departmentinput",
                    message:"What is the name of the Department?"
                }
            ]).then(ans5 =>{
                db.query("",)
            })
            //TODO:
            //inquire What is the name of the Department?
        }else if (ans.begin == "Quit"){
            console.log("Goodbye")
        } 
    })

}
begin()

function role (){
    db.query("SELECT title FROM roles",(err,data)=>{
        if (err){
            throw err
        } else{console.log(data)}
    })
}
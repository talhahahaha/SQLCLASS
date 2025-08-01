const {faker} = require('@faker-js/faker'); // Importing faker for generating fake data
const mysql = require('mysql2'); // Importing mysql2 for database operations
const express = require('express'); // Importing express for creating a web server
const app = express(); // Creating an instance of express
const path = require('path'); // Importing path for handling file paths
const methodOverride = require('method-override'); // Importing method-override for supporting HTTP verbs such as PUT and DELETE

app.use(methodOverride('_method')); // Using method-override middleware to support PUT and DELETE methods
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.set('view engine', 'ejs'); 
app.set("views", path.join(__dirname, "/views"));



const connection = mysql.createConnection({ // Creating a connection to the MySQL database
    host: 'localhost',// Database host
    user: 'root',// Database user
    password: 'Talha@19*',// Database password
    database: 'delta_app',// Database name
}); // Database connection configuration 
let getRandomUser = () => {
    return [
        faker.string.uuid(),// Generating a random UUID for user ID
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};// Function to generate a random user




//home route
app.get('/', (req, res) => { // Setting up a route for the root URL
    let q = `SELECT COUNT(*) FROM users`; // SQL query to count the number of users
     try {
     connection.query(q, (err, result) => { // Query to show all tables in the database
         if (err) throw err;
         let count = result[0]['COUNT(*)']; // Extracting the count of users from the result
         res.render("home.ejs", { userCount: count }); // Sending the result back to the client
     });
 } catch (err) {
     console.error(err);
     res.send('Error occurred while fetching data'); // Sending an error response if an error occurs
 } 

});


//SHOW route
app.get('/user', (req, res) => { 
    let q = `SELECT * FROM users`;
    try {
        connection.query(q, (err, result) => { // Query to fetch all users from the database
            if (err) throw err;
            res.render("showusers.ejs", { users: result }); // Sending the result back to the client
        });
    } catch (err) {
        console.error(err);
        res.send('Error occurred while fetching data'); // Sending an error response if an error occurs
    }
});

//edit route
app.get('/user/:id/edit', (req, res) => { // Route to edit a user by ID
    let {id} = req.params;// Extracting the user ID from the request parameters 
    let q = `SELECT * FROM users WHERE id = '${id}'`; // SQL query to fetch the user by ID
    try {
        connection.query(q, (err, result) => { // Query to fetch the user from the database
            if (err) throw err;
            res.render("edit.ejs", { user: result[0] }); // Sending the user data back to the client for editing
        });
    } catch (err) {
        console.error(err);
        res.send('Error occurred while fetching data'); // Sending an error response if an error occurs
    }
});

//update (DB)route
app.patch('/user/:id', (req, res) => { // Route to update a user by ID
    let {id} = req.params; // Extracting the user ID from the request parameters
    let {username:newUsername, password:formPass} = req.body; // Extracting username and password from the request body
    let q = `SELECT * FROM users WHERE id = '${id}'`; // SQL query to fetch the user by ID
    try {
        connection.query(q, (err, result) => { // Query to update the user in the database
            if (err) throw err;
            let user = result[0]; // Getting the user data from the result
            if(formPass != user.password){
                res.send('Password does not match'); // Sending an error response if the password does not match
            } else{
                let q2 = `UPDATE users SET username = '${newUsername}' WHERE id = '${id}'`; // SQL query to update the username
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user'); // Redirecting to the user list after successful update
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.send('Error occurred while updating data'); // Sending an error response if an error occurs
    }
});
app.listen("3000", () => {
    console.log('Server is running on port 3000');
});


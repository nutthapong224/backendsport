// db.js
const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables from .env file

// Create a connection pool to manage multiple connections
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Use environment variable for host
  user: process.env.DB_USER, // Use environment variable for user
  password: process.env.DB_PASSWORD, // Use environment variable for password
  database: process.env.DB_NAME, // Use environment variable for database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the pool for use in other modules
module.exports = pool.promise();

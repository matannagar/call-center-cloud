// db/connection.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql = require('mysql');

// RDS MySQL database connection details
const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// create sequelize connection
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: 'admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Listen for the 'connection' event to log messages
pool.on('connection', (connection) => {
    console.log('Connected to the database!');
});

// Listen for the 'error' event to handle connection errors
pool.on('error', (err) => {
    console.error('Error in the database connection pool:', err.message);
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Sequelize connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    pool,
    sequelize
};

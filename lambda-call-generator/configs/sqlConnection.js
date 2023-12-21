require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql = require('mysql');

const dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const pool = mysql.createPool(dbConfig);

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: 'admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

pool.on('connection', (connection) => {
    console.log('Connected to the database!');
});

pool.on('error', (err) => {
    console.error('Error in the database connection pool:', err.message);
});

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

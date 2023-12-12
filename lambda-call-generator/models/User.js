// models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/sqlConnection'); // Import your Sequelize connection instance

const User = sequelize.define('User', {
    // Define the model attributes (columns)
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    products: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    // Define additional options for the model
    tableName: 'users', // Set the table name if it's different from the model name
    timestamps: true, // Adds createdAt and updatedAt columns
});

module.exports = User;

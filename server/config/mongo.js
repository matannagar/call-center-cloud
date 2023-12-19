require('dotenv').config();
const mongoose = require('mongoose');

// Connection URL
const url = process.env.MONGO_URL;

async function connectMongo() {
    mongoose.connect(url)
        .then(() => {
            console.log('Connected successfully to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

module.exports = connectMongo;

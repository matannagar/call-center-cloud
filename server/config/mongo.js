require('dotenv').config();
const mongoose = require('mongoose');

async function connectMongo() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connected successfully to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

module.exports = connectMongo;

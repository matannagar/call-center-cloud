require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

client.connect();

client.on('connect', () => {
    console.log('Connected to Redis server');
});

client.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err}`);
});

module.exports = client;

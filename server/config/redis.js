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

// Event handler for successful connection
client.on('connect', () => {
    console.log('Connected to Redis server');
});

// Event handler for connection error
client.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err}`);
});

// Event handler when the connection is established and ready to use
client.on('ready', () => {
    console.log('Redis client is ready to use');
});

// Event handler when the client is about to end the connection
client.on('end', () => {
    console.log('Redis connection has been closed');
});

// Event handler when an authentication error occurs
client.on('authError', (err) => {
    console.error(`Authentication error: ${err}`);
});

// Event handler when the client receives an authentication response from the server
client.on('authenticated', () => {
    console.log('Successfully authenticated with Redis server');
});

// Handle errors during the connection process
client.on('close', () => {
    console.log('Connection to Redis server has been closed');
});

// Handle errors during the connection process
client.on('reconnecting', (params) => {
    console.log('Attempting to reconnect to Redis server', params);
});

module.exports = client;

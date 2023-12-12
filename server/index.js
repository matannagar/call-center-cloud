require('dotenv').config()
const express = require('express');
const http = require('http');
const { initializeSocket } = require('./config/socket');

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;
const { run } = require('./config/kafkaConsumer')
const { redisHandler } = require('./utils/redisFunctions')

app.get('/', (req, res) => {
    res.send('Welcome to Call Center server side');
});

server.listen(PORT, () => {
    console.log('Call center is running on port ', PORT);
    run(redisHandler).catch(console.error);
})

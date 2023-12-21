require('dotenv').config()
const express = require('express');
const http = require('http');
const { initializeSocket } = require('./config/socket');
const connectMongo = require('./config/mongo');
const callsRoutes = require('./Controllers/Call.js');
const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;
const { run } = require('./config/kafkaConsumer')
const { redisHandler } = require('./utils/redisFunctions')

app.get('/', (req, res) => {
    res.send('Welcome to Call Center server side');
});

app.use('/api', callsRoutes);

server.listen(PORT, () => {
    console.log('Call center is running on port ', PORT);
    run(redisHandler).catch(console.error);
    connectMongo();
})

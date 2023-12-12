require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { run } = require('./config/kafkaConsumer')
const { redisHandler } = require('./utils/redisFunctions')

app.get('/', (req, res) => {
    res.send('Welcome to Call Center server side');
});

app.listen(PORT, () => {
    console.log('Call center is running on port 3000');
    run(redisHandler).catch(console.error);
})

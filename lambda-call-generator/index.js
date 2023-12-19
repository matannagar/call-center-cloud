const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const usersRoutes = require('./Controller/User');
const serverless = require('serverless-http');

require('dotenv').config();

app.get('/', async (req, res) => {
    res.send(`Welcome to my SQL server`);
});

app.use('/api', usersRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// module.exports.handler = serverless(app)


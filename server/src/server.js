const express = require('express');
require('dotenv').config();
const Database = require('./configs/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
Database._connect();

app.use('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log('Server listen on port ' + port);
});

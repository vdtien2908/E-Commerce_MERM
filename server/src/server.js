const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const connectDB = require('./configs/db');
const initRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

// Cookie-Parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Init route
initRoutes(app);

app.listen(port, () => {
    console.log('Server listen on port ' + port);
});

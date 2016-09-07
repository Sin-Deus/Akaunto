'use strict';

const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 8181;
mongoose.connect(config.database);

const usersRoute = require('./app/routes/users');
const authenticationRoute = require('./app/routes/authentication');

// Log all requests to the console.
app.use(morgan('dev'));

// Use body-parser to be able to retrieve POST parameters, ...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app/public folder to be static (all files within will be directly accessible).
app.use(express.static('app/public'));

// Expose the authentication route before any middleware, and outside the API.
app.use('/authenticate', authenticationRoute);

// API routes.
app.use('/api/users', usersRoute);

// Start the server.
app.listen(port);

console.log(`Server started on port ${port}, listening...`);
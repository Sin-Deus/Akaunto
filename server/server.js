const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const q = require('q');
const app = express();
const protectedRouter = express.Router();

const port = process.env.PORT || 8181;
mongoose.Promise = q.Promise;
mongoose.connect(config.database);

const jwtMiddleware = require('./app/middlewares/jwt');
const corsMiddleware = require('./app/middlewares/cors');

const usersRoute = require('./app/routes/users');
const accountsRoute = require('./app/routes/accounts');
const operationsRoute = require('./app/routes/operations');
const authenticationRoute = require('./app/routes/authentication');

// Log all requests to the console.
app.use(morgan('dev'));
// Enable CORS.
app.use(corsMiddleware);

// Use body-parser to be able to retrieve POST parameters, ...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app/public folder to be static (all files within will be directly accessible).
app.use(express.static('app/public'));

// Expose the authentication route before any middleware, and outside the API.
app.use('/authenticate', authenticationRoute);

// Protect the router with the JWT token middleware.
protectedRouter.use(jwtMiddleware);

// API routes.
app.use('/api', usersRoute(protectedRouter));
app.use('/api', accountsRoute(protectedRouter));
app.use('/api', operationsRoute(protectedRouter));

// Start the server.
module.exports = app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server started on port ${port}, listening...`);
});

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 8181;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app/public'));

app.listen(port);

console.log(`Server started on port ${port}, listening...`);
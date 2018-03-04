'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

module.exports = app;

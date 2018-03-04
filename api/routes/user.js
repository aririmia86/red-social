'use strict';

const express = require('express');
const userController = require('../controllers/user');
const api = express.Router();

api.get('/home', userController.home);

module.exports = api;

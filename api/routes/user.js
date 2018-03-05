'use strict';

const express = require('express');
const userController = require('../controllers/user');
const api = express.Router();

api.get('/home', userController.home);
api.post('/register', userController.saveUser);

module.exports = api;

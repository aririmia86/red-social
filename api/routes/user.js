'use strict';

const express = require('express');
const userController = require('../controllers/user');
const mdAuth = require('../middlewares/authenticate');
const api = express.Router();

api.get('/home', userController.home);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.get('/user/:id', mdAuth.ensureAuth, userController.getUser);

module.exports = api;

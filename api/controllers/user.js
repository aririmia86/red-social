'use strict';

const userModel = require('../models/user');

function home(req, res) {
    res.status(200).send({
        message: 'Hello world'
    });
}

module.exports = {
    home: home
};

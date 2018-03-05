'use strict';

const bcrypt = require('bcrypt-nodejs');
const userModel = require('../models/user');

function home(req, res) {
    res.status(200).send({
        message: 'Hello world'
    });
}

function saveUser(req, res) {
    const params = req.body;
    const user = new userModel();
    if (params.name
        && params.surname
        && params.nick
        && params.email
        && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            user.save((err, userStored) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error: Something went wrong'
                    });
                }
                if (userStored) {
                    res.status(200).send({
                        user: userStored
                    });
                } else {
                    res.status(404).send({
                        message: 'Error: User not registered'
                    });
                }
            });
        });
    } else {
        res.status(400).send({
            message: 'All data is required'
        });
    }
}

module.exports = {
    home: home,
    saveUser: saveUser
};

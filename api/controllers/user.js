'use strict';

const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');
const userModel = require('../models/user');
const jwt = require('../services/jwt');

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

        // Prevent duplicate users
        userModel.find({$or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err, users) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error: Something went wrong'
                });
            }
            if (users && users.length > 0) {
                return res.status(409).send({
                    message: 'User already registered'
                });
            } else {
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
            }
        });
    } else {
        res.status(400).send({
            message: 'All data is required'
        });
    }
}

function loginUser(req, res) {
    const params = req.body;
    const email = params.email;
    const password = params.password;

    userModel.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            return res.status(500).send({
                message: 'Error: Something went wrong'
            });
        }
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
               if (check) {
                   if (params.getToken) {
                       return res.status(200).send({
                           token: jwt.createToken(user)
                       });
                   } else {
                       user.password = undefined;
                       return res.status(200).send({user});
                   }
               } else {
                   return res.status(404).send({
                       message: 'User not identified'
                   });
               }
            });
        } else {
            return res.status(404).send({
                message: 'User does not exist'
            });
        }
    });
}

function getUser(req, res) {
    const userId = req.params.id;
    userModel.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).send({
                message: 'Error: Something went wrong'
            });
        }

        if (!user) {
            return res.status(404).send({
                message: 'User does not exist'
            });
        }

        return res.status(200).send({user});
    })
}

function getUsers(req, res) {
    const identity_user_id = req.user.sub;

    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    const itemsPerPage = 5;

    userModel.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) {
            return res.status(500).send({
                message: 'Error: Something went wrong'
            });
        }

        if (!users) {
            return res.status(404).send({
                message: 'Users do not exist'
            });
        }

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    delete update.password;

    if (userId !== req.user.sub) {
        return res.status(409).send({
            message: 'Attempt to modify a different user'
        });
    }

    userModel.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Error: Something went wrong'
            });
        }

        if (!userUpdated) {
            return res.status(404).send({
                message: 'User not updated'
            });
        }

        return res.status(200).send({
            user: userUpdated
        });
    });
}

module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser
};

'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secretKey2018';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'Authorization header is mandatory'
        });
    }

    const token = req.headers.authorization
        .replace(/['"]+/g, '');

    try {
        const payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'Expired token'
            });
        }
    } catch (e) {
        return res.status(404).send({
            message: 'Invalid token'
        });
    }

    req.user = payload;
    next();
};

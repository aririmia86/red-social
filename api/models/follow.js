'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const followSchema = schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    followed: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Follow', followSchema);

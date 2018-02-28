'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const messageSchema = schema({
    emitter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'},
    text: String,
    created_at: String
});

module.exports = mongoose.model('Message', messageSchema);

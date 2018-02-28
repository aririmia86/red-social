'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
    .then(() => {
        console.log('Correct connection');
    }).catch(err => console.error(err));

'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
    .then(() => {
        app.listen(port, () => {
           console.log('Server running in http://localhost:3800');
        })
    }).catch(err => console.error(err));

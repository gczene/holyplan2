/*jslint node: true, nomen: true */

'use strict';

// get configuration
var config = {
    db: require('../config/db.json')
};

// connect to mongodb
var mongoose = require('mongoose');
mongoose.connect(config.db.uri);

// get modules
var async = require('async');

// create first user
var User = require('../models/factory').get('user');
async.waterfall([

    function (callback) {
        User.findOne({
            email: 'admin@rightster.com'
        }, callback);
    },

    function (user, callback) {
        if (user) {
            return callback(null, user);
        }
        new User({
            name: 'admin',
            email: 'gabor.czene@rightster.com',
            password: 'admin',
            roles : ['developer']
        }).save(callback);
    }

], function (err, user) {
    if (err) {
        console.error(err);
    }
    console.log({
        name: user.name,
        email: user.email
    });
    mongoose.connection.close();
});

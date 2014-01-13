/*jslint node: true */

'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    async = require('async');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    phone: Number,
    roles: Array,
    enabled: Boolean
});

module.exports = userSchema;

/**
 * Hashes a password.
 * @param {String} password
 * @param {String} salt
 * @param {Function} callback
 */
var hashPassword = function (password, salt, callback) {
    // password, salt, iterations=1000, keylen=128
    crypto.pbkdf2(password, salt, 1000, 128, callback);
};

/**
 * Generates a random salt.
 * @param {Function} callback
 */
var generateSalt = function (callback) {
    // size=128
    crypto.randomBytes(128, callback);
};

// hash password before save
userSchema.pre('save', function (next) {

    var that = this;
    async.waterfall([

        // get random salt
        generateSalt,

        // set salt, and hash password
        function (salt, callback) {
            that.salt = salt.toString('hex');
            hashPassword(that.password, that.salt, callback);
        },

        // set password
        function (password, callback) {
            that.password = password.toString('hex');
            callback();
        }

    // save user
    ], next);
});

/**
 * Authentication.
 * @param {String} email
 * @param {String} password
 * @param {Function} callback
 */
userSchema.static('authenticate', function (email, password, callback) {

    // get default parameters
    email = email || '';
    password = password || '';

    var that = this;
    async.waterfall([

        // find user by email
        function (callback) {
            that.findOne({
                email: email
            }, callback);
        },
        function (user, callback) {

            // user not found
            // invalid email address given
            // unsuccessful authentication
            if (!user) {
                return callback();
            }

            // compare passwords
            hashPassword(password, user.salt, function (err, password) {

                if (err) {
                    return callback(err);
                }

                // successful authentication
                if (user.password === password.toString('hex')) {
                    callback(null, user);

                // unsuccessful authentication
                } else {
                    callback();
                }
            });
        },

    // return errors / user
    ], callback);
});

/**
 * Authorization.
 * @param {String} userId
 * @param {String} resource
 * @param {String} privilege
 * @param {Function} callback
 */
userSchema.static('authorize', function (
    userId,
    resource,
    privilege,
    callback
) {
    this.findById(userId, function (err, user) {

        if (err) {
            return callback(err);
        }

        var hasAccess = user && user.hasAccess(resource, privilege);
        callback(null, hasAccess);
    });
});

/**
 * Returns a user's privileges.
 * @param {String} userId
 * @param {String} resource
 * @param {Function} callback
 */
userSchema.static('privileges', function (userId, resource, callback) {
    this.findById(userId, function (err, user) {

        if (err) {
            return callback(err);
        }

        callback(null, user.privileges(resource));
    });
});

/**
 * Authorization.
 * @param {String} resource
 * @param {String} privilege
 * @return {Boolean}
 */
userSchema.method('hasAccess', function (resource, privilege) {
    return !!this.privileges(resource)[privilege];
});

/**
 * Returns a user's privileges.
 * @param {String} resource
 * @return {Object}
 */
userSchema.method('privileges', function (resource) {
    return this.permissions[resource] || {};
});

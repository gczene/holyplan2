/*jslint node: true */

'use strict';

var mongoose = require('mongoose');

/**
 * Model factory.
 * @author Gabor Sar <gabor.sar@rightster.com>
 */
var factory = exports;

/**
 * Available schemas.
 * @type {Object}
 */
factory.schemas = {
    user: require('./schemas/user')
};

/**
 * Model instances.
 * @type {Object}
 */
factory.models = {};

/**
 * Returns model instance.
 * @param {String} name
 * @param {String} prefix
 * @return {Mixed}
 */
factory.get = function (name, prefix) {

    // validate name
    if (!this.schemas[name]) {
        throw new Error(name + ' schema cannot be found');
    }

    // get prefix
    var modelName = prefix ? prefix + '.' + name : name;

    // init model (if have to)
    if (!this.models[modelName]) {
        this.models[modelName] = mongoose.model(
            modelName,
            this.schemas[name]
        );
    }

    // return model
    return this.models[modelName];
};

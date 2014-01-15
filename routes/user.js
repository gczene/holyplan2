/*jslint node: true */

'use strict';

var user = exports;

user.render = function (req, res) {

    res.send('user render');

};

/**
 * user session checking middleware
 */
user.restrict = function (req, res, next) {

    // there is no checking in login page
    if ( req.params.route != 'login' && req.params.route != 'register' && ! req.session.userId) {
        res.redirect('/login');
    } else{
        next();
    }

};

user.login = function (req, res, next) {
    res.render('login', {
        title : 'Login',
        scripts : [
            '/js/login.js'
        ]
    });
}
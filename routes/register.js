/*jslint node: true */

'use strict';


var reg = exports,
    tplshare = require('tplshare');

reg.render = function (req, res) {
    tplshare.get({}, function (err, templates) {
        if (err) {
            next(err);
        }
        
        res.render('login', {
            partials : {
                view : 'partials/register'
            },
            scripts : ['/js/register.js']
        });      
    })
}

/*jslint node: true, unparam: true */

'use strict';

var router = exports,
    fs = require('fs');

/**
 * ignire these files from stored available routes
 * @type {Array}
 */
router.ignore = [
    'router.js'
];

/**
 * store available routes
 * @type {Object}
 */
router.routes = { };

/**
 * get the available routes from ./routes dir
 * load it to router.routes
 *
 * @param  string   path
 * @return this
 */
router.getRoutes = function (path) {

    var files = fs.readdirSync (path);

        if (Object.keys(router.routes).length === 0){
            files.forEach( function ( fileName ) {
                if ( router.ignore.indexOf(fileName) === -1 ) {
                    var key = fileName.replace(/\.js$/, '');
                    router.routes[ key ] = require('./' + fileName);
                }
            });
        }
        router.restrict = router.routes.user.restrict;
        router.login    = router.routes.user.login;

    return this;
};



router.render = function (req, res, next) {
    // router.getRoutes('./routes/', function(err, files){
    //     console.log(files);
    // });

    var routeName = req.params.route || 'index',
        route = router.routes[routeName] || null;

    if (route) {
        route.render(req, res, next);
    }
    else {
        res.send('this route does not exist: ' + routeName);
    }
};

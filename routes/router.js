/*jslint node: true, unparam: true */

'use strict';

var router = exports,
    fs = require('fs');

router.ignore = [
    'router.js'
];

router.routes = { };

// router.routes = {
//     user : require('./user'),
//     register : require('./register')
// };

router.getRoutes = function (path) {

    var files = fs.readdirSync (path);


        // console.log(files);

        files.forEach( function ( fileName ) {
            if ( router.ignore.indexOf(fileName) === -1 ) {
                var key = fileName.replace(/\.js$/, '');
                router.routes[ key ] = require('./' + fileName);
            }
        });
        router.restrict = router.routes.user.restrict;
        router.login    = router.routes.user.login;

    return this;
};


router.test = function (req, res) {

    res.send('ez a test oldal');

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

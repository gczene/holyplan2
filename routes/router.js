/*jslint node: true, unparam: true */

'use strict';

var router = exports;

router.routes = {
    user : require('./user')
};

router.restrict = router.routes.user.restrict;
router.login    = router.routes.user.login;

router.test = function (req, res) {

    res.send('ez a test oldal');

};

router.render = function (req, res, next) {
    var routeName = req.params.route || 'index',
        route = router.routes[routeName] || null;

    if (route) {
        console.log(req.params);
        route.render(req, res, next);
    }
    else {
        res.send('this route does not exist: ' + routeName);
    }
};

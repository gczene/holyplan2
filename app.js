/*jslint node: true, nomen: true*/

'use strict';

//get config
var config = require('./config/config');

// connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hp');

// get modules
var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    tplshare = require('tplshare'),
    RedisStore = require('connect-redis')(express),
    flash = require('connect-flash'),
    router = require('./routes/router').getRoutes('./routes');

// init application
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.locals(config.locals);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.session.secret));
app.use(express.session({ store: new RedisStore(), secret: config.session.secret}));
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// configure template sharing
tplshare.setPath(app.get('views'));
tplshare.setExtension(app.get('view engine'));

// login
app.get('/login', router.login);

app.get('/', router.restrict, router.render);
app.get('/:route', router.restrict, router.render);

if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// creare and start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
